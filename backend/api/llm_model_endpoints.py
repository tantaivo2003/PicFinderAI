# Import các thư viện chuẩn của Python
import json
import os
import shutil
import argparse
from datetime import datetime
from pathlib import Path
from typing import Optional

# Import các thư viện bên ngoài
import numpy as np
import faiss
import torch
import torch.nn.functional as F
from PIL import Image as PILImage
from langdetect import detect
from googletrans import Translator
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session
from torchvision import transforms
from torchvision.transforms import InterpolationMode
from ruamel.yaml import YAML

# Import các module nội bộ của dự án
from app import crud, schemas, models
from app.database import SessionLocal, get_db
from models.model_retrieval import CFACKCModel
from dataset import build_tokenizer
import utils

router = APIRouter()

CHECKPOINT_PATH = "1b_convnext_base_laion_2b_79629.th"
CONFIGS = "./configs/finetune/cuhk_pedes_ckc_mm_mlm.yaml"
OUTPUT_DIR = "outputs/response"

device = 'cuda' if torch.cuda.is_available() else 'cpu'
parser = argparse.ArgumentParser()
parser.add_argument('--checkpoint', type=str, default=CHECKPOINT_PATH)
parser.add_argument('--config', type=str, default=CONFIGS)
parser.add_argument('--output_dir', type=str, default=OUTPUT_DIR)
parser.add_argument('--evaluate', action='store_true', default=True)
parser.add_argument('--override_cfg', default="", type=str, help="Use ; to separate keys")
args, _ = parser.parse_known_args()

yaml = YAML(typ='safe')
with open(args.config, 'r') as file:
    config = yaml.load(file)

utils.update_config(config, args.override_cfg)
if utils.is_main_process():
    print('config:', json.dumps(config))

Path(args.output_dir).mkdir(parents=True, exist_ok=True)
yaml.dump(config, open(os.path.join(args.output_dir, 'config.yaml'), 'w'))

model = CFACKCModel(config=config)
model.load_pretrained(args.checkpoint, config, is_eval=args.evaluate, use_mlm_loss=config["mlm"])
model = model.to(device)
tokenizer = build_tokenizer(config['text_tokenizer'])

def load_image_embeddings_from_db():
    db: Session = SessionLocal()
    try:
        images = db.query(models.Image).all()
        image_paths = [image.img_path for image in images]
        embeddings = [np.frombuffer(image.embedding, dtype=np.float32) for image in images if image.embedding and isinstance(image.embedding, (bytes, bytearray)) and len(image.embedding) > 0]
        embedding_dim = len(embeddings[0])
        index = faiss.IndexFlatIP(embedding_dim)
        index.add(np.vstack(embeddings))
        return image_paths, index
    finally:
        db.close()

image_paths, embedding_index = load_image_embeddings_from_db()

@torch.no_grad()
def unit_test(text, model, tokenizer, device, config, image_paths, embedding_index):
    translator = Translator()
    if detect(text) == 'vi':
        text = translator.translate(text, src='vi', dest='en').text
    text_input = tokenizer(text, padding='max_length', truncation=True, max_length=config['max_tokens'], return_tensors="pt").to(device)
    text_feat = model.get_text_embeds(text_input.input_ids, text_input.attention_mask)
    text_embed = model.get_features(text_embeds=text_feat)
    text_embed = F.normalize(model.text_proj(text_feat[:, 0, :]))
    text_embed = text_embed.detach().cpu().numpy()
    D, I = embedding_index.search(text_embed, 100)
    top_images = [image_paths[idx] for idx in I[0]]
    top_sims = D[0].tolist()
    results = list(zip(top_images, top_sims))
    results.sort(key=lambda x: x[1], reverse=True)
    return results

@router.get("/query/{query}")
def search_by_model(query: str, db: Session = Depends(get_db)):
    search_results = unit_test(query, model, tokenizer, device, config, image_paths, embedding_index)
    final_results = []
    for img_path, score in search_results:
        db_image = db.query(models.Image).filter(models.Image.img_path == img_path).first()
        if db_image:
            image_response = schemas.ImageResponse.model_validate(db_image)
            final_results.append(image_response)
    return final_results

@router.delete("/albums/{album_id}")
def delete_album(album_id: int, db: Session = Depends(get_db)):
    # Xóa album khỏi cơ sở dữ liệu
    crud.delete_album(db, album_id)

    album_folder_path = os.path.join("app/imgs", str(album_id))
    # Kiểm tra nếu thư mục có tồn tại
    if not os.path.exists(album_folder_path):
        raise HTTPException(status_code=404, detail="Thư mục album không tồn tại")
    
    # Xóa thư mục và nội dung bên trong
    try:
        shutil.rmtree(album_folder_path)

        global image_paths, embedding_index
        image_paths, embedding_index = load_image_embeddings_from_db()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi xóa thư mục album: {str(e)}")
    
    return {"ok": True}


@router.post("/upload-images/")
async def upload_images(
    album_id: int = Form(...),
    img_path: str = Form(...),
    captions: Optional[str] = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    if file.content_type not in ["image/jpeg", "image/png", "image/jpg", "image/webp"]:
        raise HTTPException(status_code=400, detail="File type not allowed")

    try:
        # Lấy thời gian hiện tại và định dạng nó
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")

        # Đường dẫn thư mục chứa ảnh đại diện
        avatar_dir = f"app/imgs/{album_id}/"
        
        # Tạo thư mục nếu chưa tồn tại
        os.makedirs(avatar_dir, exist_ok=True)

        # Tạo đường dẫn tệp mới với ID và timestamp
        file_name_in_db = os.path.join(f"{album_id}_{img_path}_{timestamp}.jpg")
        file_location = os.path.join(avatar_dir, f"{album_id}_{img_path}_{timestamp}.jpg")

        with open(file_location, "wb") as file_object:
            file_object.write(file.file.read())

        # Cập nhật trong db
        new_image = crud.create_image(db=db, image=schemas.ImageCreate(
            album_id=album_id,
            img_path=file_name_in_db,
            captions=captions,
            upload_date=datetime.now().date(),
        ))

        # Gọi hàm embed_image để thêm embedding
        embed_image(image_path=file_location, model=model, device=device, config=config, session=db, db_image=new_image)
        return {"file_location": file_location}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while uploading the file. Error: {str(e)}")
    
def embed_image(image_path, model, device, config, session, db_image):
    # Chuẩn bị transform cho ảnh
    normalize = transforms.Normalize((0.48145466, 0.4578275, 0.40821073), (0.26862954, 0.26130258, 0.27577711))
    transform = transforms.Compose([
        transforms.Resize((config['image_res'], config['image_res']), interpolation=InterpolationMode.BICUBIC),
        transforms.ToTensor(),
        normalize,
    ])

    # Mở và transform ảnh
    image = PILImage.open(image_path).convert('RGB')
    image = transform(image).unsqueeze(0).to(device)

    # Tính toán embedding
    with torch.no_grad():
        image_feat, _ = model.get_vision_embeds(image)
        image_embed = model.get_features(image_embeds=image_feat).detach().cpu().numpy()

    # Cập nhật embedding cho ảnh đó
    db_image.embedding = image_embed.tobytes()  # Chuyển numpy array thành bytes để lưu vào BLOB
    session.add(db_image)
    session.commit()

    global image_paths, embedding_index
    image_paths, embedding_index = load_image_embeddings_from_db()

@router.delete("/albums/images/")
def delete_image(image: schemas.Image, db: Session = Depends(get_db)):
    delete_image = crud.delete_image(db, image.id)
    if not delete_image:
        raise HTTPException(status_code=404, detail="Ảnh không tồn tại trong cơ sở dữ liệu")

    # Xóa ảnh khỏi thư mục local
    image_path = Path("app/imgs") / str(delete_image.album_id) / str(delete_image.img_path)
    try:
        if image_path.exists():
            image_path.unlink()  # Xóa file ảnh
        global image_paths, embedding_index
        image_paths, embedding_index = load_image_embeddings_from_db()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi xóa file ảnh: {str(e)}")
    
    return {"ok": True}