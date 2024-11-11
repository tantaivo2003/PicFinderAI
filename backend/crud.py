from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import func
import app.schemas as schemas
import app.models as models
from passlib.context import CryptContext
from fastapi import HTTPException
from datetime import date
import uuid
from pathlib import Path
from datetime import datetime
import pytz
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user(db: Session, id: int):
    return db.query(models.User).filter(models.User.id == id).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(username=user.username, email=user.email, password=hashed_password, role="user")
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, id: int):    
    user = db.query(models.User).filter(models.User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.role == "admin":
        raise HTTPException(status_code=403, detail="Cannot delete an admin user")
    
    # Nếu role không phải là admin, tiến hành xóa user
    db.query(models.User).filter(models.User.id == id).delete()
    db.commit()

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return False
    if not pwd_context.verify(password, user.password):
        return False
    return user

def admin_change_user_info(db: Session, user: schemas.UserInDB):
    db_user = get_user(db, user.id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if db_user.email!= user.email:
        if get_user_by_email(db, user.email):
            raise HTTPException(status_code=409, detail="Email already exists")
        db_user.email = user.email
    for key, value in user.model_dump().items():
        if key != "id" and value is not None:
            setattr(db_user, key, value)
    
    db.commit()

def change_user_account(db: Session, user: schemas.UserChangeAccount):
    db_user = get_user(db, user.id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db_user.username = user.username
    if db_user.email!= user.email:
        if get_user_by_email(db, user.email):
            raise HTTPException(status_code=409, detail="Email already exists")
        db_user.email = user.email
    
    db.commit()

def change_user_profile(db: Session, user: schemas.UserChangeProfile):
    db_user = get_user(db, user.id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    for key, value in user.model_dump().items():
        if key != "id" and value is not None:
            setattr(db_user, key, value)

    db.commit()

def change_user_password(db: Session, id: int, password: str):
    db_user = get_user(db, id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_user.password = pwd_context.hash(password)
    db.commit()

# Album management
def get_user_albums(db: Session, user_id: int):
    return db.query(models.Album).filter(models.Album.owner_id == user_id).all()

def create_album(db: Session, album: schemas.AlbumCreate):
    db_album = models.Album(**album.model_dump())
    db.add(db_album)
    db.commit()
    db.refresh(db_album)
    return db_album

def update_album(db: Session, album_id: int, album: schemas.AlbumUpdate):
    db_album = db.query(models.Album).filter(models.Album.id == album_id).first()
    if db_album:
        for key, value in album.model_dump().items():
            setattr(db_album, key, value)
        db.commit()
        db.refresh(db_album)
    return db_album

def delete_album(db: Session, album_id: int):
    db_album = db.query(models.Album).filter(models.Album.id == album_id).first()
    if db_album:
        db.delete(db_album)
        db.commit()

def get_album_owner(db: Session, album_id: int):
    album = db.query(models.Album).filter(models.Album.id == album_id).first()
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")
    
    return db.query(models.User).filter(models.User.id == album.owner_id).first()

# Image management
def create_image(db: Session, image: schemas.ImageCreate):    
    # Create the Image record in the database
    db_image = models.Image(**image.model_dump())
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    
    return db_image

def get_images(db: Session, skip: int, limit: int):
    images = db.query(models.Image).offset(skip).limit(limit).all()
    return [schemas.ImageResponse.model_validate(image) for image in images]


def get_random_images(db: Session, n: int):
    images = (db.query(models.Image).order_by(func.random()).limit(n).all())
    return [schemas.ImageResponse.model_validate(image) for image in images]

def get_images_by_id(id: int, db: Session):
    image = db.query(models.Image).filter(models.Image.id == id).first()
    if image:
        return schemas.ImageResponse.model_validate(image)
    return None

# Album images management
def get_album_images(db: Session, album_id: int, skip: int, limit: int):
    images = db.query(models.Image).filter(models.Image.album_id == album_id).offset(skip).limit(limit).all()
    return [schemas.ImageResponse.model_validate(image) for image in images]

def delete_image(db: Session, image_id: int):
    image = db.query(models.Image).filter(models.Image.id == image_id).first()
    if image:
        db.delete(image)
        db.commit()
    return image

def set_avatar(db: Session, user_id: int, file_location: str):
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.avatar = file_location
    db.commit()

def search_users(db: Session, query: str):
    return db.query(models.User).filter(models.User.username.contains(query) | models.User.email.contains(query)).all()

# User's history
def create_search_history(db: Session, history: schemas.HistoryCreate):
    # Tạo một đối tượng History mới
    new_history = models.History(
        search_term=history.search_term,
        user_id=history.user_id,
        timestamp=datetime.now(pytz.utc)
    )
    
    # Thêm đối tượng vào cơ sở dữ liệu
    db.add(new_history)
    db.commit()
    db.refresh(new_history)
    
    return new_history

def get_search_history(db: Session, user_id: int):
    # Truy vấn cơ sở dữ liệu để lấy lịch sử tìm kiếm của người dùng
    return db.query(models.History).filter(models.History.user_id == user_id).order_by(models.History.timestamp.desc()).all()

def delete_search_history(db: Session, history_id: int):
    # Tìm bản ghi History dựa trên ID
    history_to_delete = db.query(models.History).filter(models.History.id == history_id).first()
    
    if history_to_delete:
        db.delete(history_to_delete)
        db.commit()
        return True
    return False

def delete_all_search_history(db: Session, user_id: int):
    # Xóa toàn bộ lịch sử tìm kiếm của người dùng
    histories_to_delete = db.query(models.History).filter(models.History.user_id == user_id).all()
    
    if histories_to_delete:
        for history in histories_to_delete:
            db.delete(history)
        db.commit()
        return True
    return False