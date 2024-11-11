# Import các thư viện chuẩn của Python
from datetime import datetime
import os
import glob

# Import các thư viện bên ngoài
from fastapi import APIRouter, Depends, HTTPException, Request, File, UploadFile
from sqlalchemy.orm import Session

# Import các module nội bộ của dự án
from app import crud, schemas
from app.database import get_db
from app.services.session_management import get_session


router = APIRouter()

@router.get("/users/", response_model=list[schemas.UserInDB], tags=["users"])
def read_users(skip: int, limit: int, request: Request, db: Session = Depends(get_db)):
    session_id = request.cookies.get("session_id")
    if not session_id:
        return False
    session = get_session(session_id)
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")
    if (session.role != "admin"): return []    
    users = crud.get_users(db, skip, limit)
    return users

@router.get("/users/{username}", response_model=schemas.UserInDB, tags=["users"])
def read_user(username: str, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username=username)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.get("/users_by_id/{id}", response_model=schemas.UserInDB, tags=["users"])
def read_user(id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, id=id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.get("/now_user/")
def read_now_user(request: Request, db: Session = Depends(get_db), tags=["users"]):
    session_id = request.cookies.get("session_id")
    if not session_id:
        return False
    session = get_session(session_id)
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    return {"username": session.username, "role": session.role}

@router.get("/now_user_id/", tags=["users"])
def read_now_user_full(request: Request, db: Session = Depends(get_db)):
    session_id = request.cookies.get("session_id")
    if not session_id:
        return False
    session = get_session(session_id)
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")
    return crud.get_user_by_username(db, username=session.username).id

@router.get("/now_user_full/", tags=["users"])
def read_now_user_full(request: Request, db: Session = Depends(get_db)):
    session_id = request.cookies.get("session_id")
    if not session_id:
        return False
    session = get_session(session_id)
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")
    return crud.get_user_by_username(db, username=session.username)

@router.delete("/users/{id}", tags=["users"])
def delete_user(id: int, db: Session = Depends(get_db)):
    crud.delete_user(db, id=id)
    return {"ok": True}

@router.post("/admin/change_user_info", tags=["users"])
def admin_change_user_info(user: schemas.UserInDB, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, id=user.id)
    if db_user is None:
        return False
    
    # Kiểm tra xem username mới có trùng với bất kỳ người dùng nào khác không
    existing_user_by_username = crud.get_user_by_username(db, username=user.username)
    if existing_user_by_username and existing_user_by_username.id != user.id:
        return False

    # Kiểm tra xem email mới có trùng với bất kỳ người dùng nào khác không
    existing_user_by_email = crud.get_user_by_email(db, email=user.email)
    if existing_user_by_email and existing_user_by_email.id != user.id:
        return False
    
    crud.admin_change_user_info(db=db, user=user)

    return {"message": "Changed successfully"}

@router.post("/change_user_account", tags=["users"])
def change_user_account(user: schemas.UserChangeAccount, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, id=user.id)
    if db_user is None:
        return False
    
    # Kiểm tra xem username mới có trùng với bất kỳ người dùng nào khác không
    existing_user_by_username = crud.get_user_by_username(db, username=user.username)
    if existing_user_by_username and existing_user_by_username.id != user.id:
        return False
    # Kiểm tra xem email mới có trùng với bất kỳ người dùng nào khác không
    existing_user_by_email = crud.get_user_by_email(db, email=user.email)
    if existing_user_by_email and existing_user_by_email.id != user.id:
        return False

    crud.change_user_account(db=db, user=user)

    return {"message": "Changed successfully"}

@router.post("/change_user_profile", tags=["users"])
def change_user_profile(user: schemas.UserChangeProfile, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, id=user.id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    crud.change_user_profile(db=db, user=user)

    return {"message": "Changed successfully"}

@router.post("/change_password", tags=["users"])
def change_user_password(user: schemas.UserChangePassword, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, id=user.id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    crud.change_user_password(db=db, id=user.id, password=user.password)
    return {"message": "Password changed successfully"}

@router.post("/upload-avatar/{id}")
async def upload_avatar(id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    if file.content_type not in ["image/jpeg", "image/png", "image/jpg", "image/webp"]:
        raise HTTPException(status_code=400, detail="File type not allowed")
    
    try:
        # Lấy thời gian hiện tại và định dạng nó
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")

        # Đường dẫn thư mục chứa ảnh đại diện
        avatar_dir = "./app/imgs/user_avatar/"
        
        # Tìm tất cả các tệp bắt đầu bằng id trong thư mục ảnh đại diện
        old_files = glob.glob(os.path.join(avatar_dir, f"{id}_*.jpg"))
        
        # Xóa tất cả các tệp cũ
        for old_file in old_files:
            os.remove(old_file)
        
        # Tạo đường dẫn tệp mới với ID và timestamp
        file_location = os.path.join(avatar_dir, f"{id}_{timestamp}.jpg")
        with open(file_location, "wb") as file_object:
            file_object.write(file.file.read())

        # Cập nhật giá trị URL ảnh đại diện trong cơ sở dữ liệu
        crud.set_avatar(db, user_id=id, file_location=f"{id}_{timestamp}.jpg")

        return { "file_location": file_location }
    except Exception as e:
        raise HTTPException(status_code=500, detail="An error occurred while uploading the file.")

@router.get("/search_users/{query}")
def search_users(query: str, request: Request, db: Session = Depends(get_db)):
    session_id = request.cookies.get("session_id")
    if not session_id:
        return False
    session = get_session(session_id)  # Lấy thông tin session từ session ID
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")
    if session.role != "admin": return []
    return crud.search_users(db, query)
