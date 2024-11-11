import datetime

from sqlalchemy import Column, Integer, String, Text, ForeignKey, Date, Boolean, DateTime, BLOB
from sqlalchemy.orm import relationship

from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    first_name = Column(String)
    last_name = Column(String)
    birthday = Column(Date)
    avatar = Column(String)
    gender = Column(String)
    phone_number = Column(String)
    address = Column(String)
    role = Column(String)
    is_banned = Column(Boolean, default=False)

    albums = relationship("Album", back_populates="owner")
    history = relationship("History", back_populates="user")

class Album(Base):
    __tablename__ = "albums"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    is_visible = Column(Boolean, default=True)

    owner_id = Column(Integer, ForeignKey('users.id'))
    
    owner = relationship("User", back_populates="albums")
    images = relationship("Image", back_populates="album")
    
class Image(Base):
    __tablename__ = "images"
    
    id = Column(Integer, primary_key=True, index=True)
    img_path = Column(String, nullable=False)
    captions = Column(String)
    upload_date = Column(Date)
    album_id = Column(Integer, ForeignKey('albums.id'))
    embedding = Column(BLOB, nullable=True)  # Thêm cột embedding
    album = relationship("Album", back_populates="images")

class History(Base):
    __tablename__ = "history"
    
    id = Column(Integer, primary_key=True, index=True)
    search_term = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    user_id = Column(Integer, ForeignKey('users.id'))
    
    user = relationship("User", back_populates="history")