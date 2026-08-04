from datetime import datetime, timedelta, timezone
from jose import jwt

from core.config import settings


def crear_token(data: dict) -> str:
    datos_token = data.copy()
    expira = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
    datos_token.update({"exp": expira})
    return jwt.encode(datos_token, settings.secret_key, algorithm=settings.algorithm)