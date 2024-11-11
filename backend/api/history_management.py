# Import các thư viện bên ngoài
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

# Import các module nội bộ của dự án
from app import crud, schemas
from app.database import get_db


router = APIRouter()

@router.post("/")
def create_search_history(history: schemas.HistoryCreate, db: Session = Depends(get_db)):
    try:
        new_history = crud.create_search_history(db, history)
        return new_history
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{user_id}")
def get_search_history_endpoint(user_id: int, db: Session = Depends(get_db)):
    histories = crud.get_search_history(db, user_id)
    if not histories:
        raise HTTPException(status_code=404, detail="No history found for user")
    return histories

@router.delete("/{history_id}")
def delete_search_history_endpoint(history_id: int, db: Session = Depends(get_db)):
    success = crud.delete_search_history(db, history_id)
    if not success:
        raise HTTPException(status_code=404, detail="History not found")
    return {"message": "Search history deleted successfully"}

@router.delete("/user/{user_id}")
def delete_all_search_history_endpoint(user_id: int, db: Session = Depends(get_db)):
    success = crud.delete_all_search_history(db, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="No history found for user")
    return {"message": "All search history for user deleted successfully"}
