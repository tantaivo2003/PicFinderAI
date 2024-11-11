# Import các thư viện chuẩn của Python
from pathlib import Path
from typing import List

# Import các thư viện bên ngoài
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

# Import các module nội bộ của dự án
from app import crud, schemas
from app.database import get_db

router = APIRouter()

# Lấy danh sách albums của người dùng
@router.get("/albums", response_model=List[schemas.Album])
def get_albums(user_id: int, db: Session = Depends(get_db)):
    return crud.get_user_albums(db, user_id=user_id)

@router.get("/albums/images/")
def get_album_images(album_id: int, skip: int, limit: int, db: Session = Depends(get_db)):
    return crud.get_album_images(db=db, album_id=album_id, skip=skip, limit=limit)

@router.get("/albums/{album_id}/owner", response_model=schemas.UserBase)
def get_album_owner(album_id: int, db: Session = Depends(get_db)):
    owner = crud.get_album_owner(db, album_id=album_id)
    if not owner:
        raise HTTPException(status_code=404, detail="User not found")
    return owner

@router.post("/albums", response_model=schemas.Album)
def create_album(album: schemas.AlbumCreate, db: Session = Depends(get_db)):
    new_album = crud.create_album(db=db, album=album)    

    save_path = Path("app/imgs") / str(new_album.id)
    try:
        save_path.mkdir(parents=True, exist_ok=True)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi tạo thư mục album: {str(e)}")
    
    return new_album

@router.post("/albums/{album_id}", response_model=schemas.Album)
def update_album(album_id: int, album: schemas.AlbumUpdate, db: Session = Depends(get_db)):
    return crud.update_album(db=db, album_id=album_id, album=album)
