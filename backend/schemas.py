from pydantic import BaseModel
from datetime import date
from typing import Optional
from datetime import datetime
class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    id: int
    role: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    birthday: Optional[date] = None
    avatar: Optional[str] = None
    gender: Optional[str] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: str
    password: str
    rememberme: bool

class UserChangeAccount(BaseModel):
    id: int
    role: str
    username: str
    email: str

class UserChangeProfile(BaseModel):
    id: int
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    birthday: Optional[date] = None
    avatar: Optional[str] = None
    gender: Optional[str] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None
    class Config:
        from_attributes = True

class UserChangePassword(BaseModel):
    id: int
    password: str

# Album schemas
class AlbumBase(BaseModel):
    name: str
    is_visible: bool = True

class AlbumCreate(AlbumBase):
    owner_id: int

class AlbumUpdate(AlbumBase):
    pass

class Album(AlbumBase):
    id: int

    class Config:
        from_attributes = True

# Image schemas
class ImageBase(BaseModel):
    album_id: int

class ImageCreate(ImageBase):
    img_path: str
    captions: Optional[str] = None

class ImageResponse(ImageBase):
    id: int
    img_path: str
    captions: Optional[str] = None
    upload_date: Optional[datetime] = None

    class Config:
        from_attributes = True

class ImageSearchResponse(ImageBase):
    id: int
    img_path: str
    score: float
    captions: Optional[str] = None
    upload_date: Optional[datetime] = None

    class Config:
        from_attributes = True

class Image(ImageBase):
    id: int

    class Config:
        from_attributes = True

# History schemas
class HistoryCreate(BaseModel):
    search_term: str
    user_id: int
    
class HistoryBase(HistoryCreate):
    pass
