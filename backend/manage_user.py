import os
import secrets
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from itsdangerous import URLSafeTimedSerializer, BadSignature

SECRET_KEY = os.getenv("SECRET_KEY", secrets.token_hex(32))
SESSION_TIMEOUT = 86400  # 24 hours

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

serializer = URLSafeTimedSerializer(SECRET_KEY)

sessions = {}

class SessionUser:
    def __init__(self, username, role):
        self.username = username
        self.role = role

def create_session(username: str, role: str):
    session_id = serializer.dumps({"username": username, "role": role})
    sessions[session_id] = SessionUser(username, role)
    return session_id

def get_session(session_id: str = Depends(oauth2_scheme)):
    try:
        data = serializer.loads(session_id, max_age=SESSION_TIMEOUT)
        return sessions.get(session_id)
    except BadSignature:
        raise HTTPException(status_code=401, detail="Invalid session")
    except:
        return None
