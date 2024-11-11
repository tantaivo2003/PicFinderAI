# Import các thư viện bên ngoài
from fastapi import APIRouter, Depends, HTTPException, Response, Request
from sqlalchemy.orm import Session

# Import các module nội bộ của dự án
from app import crud, schemas
from app.database import get_db
from app.services.session_management import create_session

router = APIRouter()

@router.post("/register/", tags=["auth"])
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        return False
    db_user = crud.get_user_by_email(db, email = user.email)
    if db_user:
        return False
    crud.create_user(db=db, user=user)
    return True

@router.post("/login/", tags=["auth"])
def login(user: schemas.UserLogin, response: Response, db: Session = Depends(get_db)):
    db_user = crud.authenticate_user(db, email=user.email, password=user.password)
    if not db_user:
        return False
    session_id = create_session(db_user.username, db_user.role)
    if user.rememberme:
        response.set_cookie(key="session_id", value=session_id, max_age=60*60*24*365, httponly=True)
    else:
        response.set_cookie(key="session_id", value=session_id, httponly=True)
    return True

@router.post("/logout/", tags=["auth"])
def logout(response: Response):
    response.delete_cookie("session_id")
    return {"message": "Logout successful"}
