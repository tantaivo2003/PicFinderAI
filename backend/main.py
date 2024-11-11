# Import các thư viện chuẩn của Python
import os
import shutil
from datetime import datetime
from pathlib import Path

# Import các thư viện bên ngoài
import uvicorn
from fastapi import FastAPI, Depends, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

# Import các module nội bộ của dự án
import app.crud as crud
import app.models as models
import app.schemas as schemas
from app.database import SessionLocal, engine
from app.api import auth, user_management, history_management, albums_management, images_management, llm_model_endpoints

# Tạo bảng trong cơ sở dữ liệu nếu chưa có
models.User.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:3000",
    "localhost:3000",
    "https://vsearch-intern.gvlab.org",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(user_management.router) 
app.include_router(history_management.router, prefix="/history", tags=["History"])
app.include_router(albums_management.router, tags=["Albums"])
app.include_router(images_management.router, tags=["Images"])
app.include_router(llm_model_endpoints.router, tags=["LLM Model Endpoints"])

# Cấu hình StaticFiles để phục vụ các tệp từ thư mục imgs
app.mount("/imgs", StaticFiles(directory="./app/imgs"), name="imgs")

if __name__ == "__main__":    
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000)
