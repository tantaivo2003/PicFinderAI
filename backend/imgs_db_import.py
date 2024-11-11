from sqlalchemy import create_engine, Column, Integer, String, Text, ForeignKey, Date, Boolean, DateTime, BLOB
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.orm import sessionmaker
import datetime
import json
import pytz
# Kết nối đến cơ sở dữ liệu MySQL
USERNAME = 'root'
PASSWORD = ''
HOST = 'localhost'
PORT = '3306'
DATABASE = 'search_app_v2'

DATABASE_URL = f"mysql+pymysql://{USERNAME}:{PASSWORD}@{HOST}:{PORT}/{DATABASE}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

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
# Tạo bảng nếu chưa tồn tại
Base.metadata.create_all(engine)

# Tạo session để thực hiện thao tác với cơ sở dữ liệu
Session = sessionmaker(bind=engine)
session = Session()

# Đọc dữ liệu từ file JSON
with open('../data/RSTPReid//data_captions.json') as f:
    data = json.load(f)

# Lấy 100 ảnh đầu tiên
data_split = data

# Chèn dữ liệu vào bảng
for item in data_split:
    new_image = Image(
        img_path=item['img_path'],
        captions='; '.join(item['captions']),  # Nối các caption lại thành một chuỗi
        upload_date= datetime.datetime.now().strftime("%Y%m%d%H%M%S"),  # Thêm ngày tạo ảnh
        album_id = 1,
    )
    session.add(new_image)

# Commit thay đổi
session.commit()
