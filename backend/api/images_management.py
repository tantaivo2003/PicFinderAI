# Import các thư viện bên ngoài
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

# Import các module nội bộ của dự án
from app import crud, schemas
from app.database import get_db


router = APIRouter()

# Get images directly
@router.get("/images/")
def read_images(skip: int, limit: int, db: Session = Depends(get_db)):
    images = crud.get_images(db,skip, limit)
    return images

@router.get("/random_images/")
def read_random_images(total:int, db: Session = Depends(get_db)):
    images = crud.get_random_images(db, total)
    return images

@router.get("/images/{id}")
def read_images(id: int, db: Session = Depends(get_db)):
    images = crud.get_images_by_id(id, db)
    return images