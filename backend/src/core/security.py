from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone

from core.roles import Rol
from core.database import get_db
from core.config import settings
from repositories.usuarios.usuario_repository import obtener_por_id
from models.usuario import Usuario


def crear_token(data: dict) -> str:
    datos_token = data.copy()
    expira = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
    datos_token.update({"exp": expira})
    return jwt.encode(datos_token, settings.secret_key, algorithm=settings.algorithm)


security_scheme = HTTPBearer()


def get_usuario_actual(credentials: HTTPAuthorizationCredentials = Depends(security_scheme), db: Session = Depends(get_db)) -> Usuario:
    credenciales_invalidas = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudo validar la sesión",
    )
    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        usuario_id = payload.get("sub")
        if usuario_id is None:
            raise credenciales_invalidas
    except JWTError:
        raise credenciales_invalidas

    usuario = obtener_por_id(db, int(usuario_id))
    if usuario is None:
        raise credenciales_invalidas
    return usuario


def requerir_rol(rol_esperado: Rol):
    def verificar(usuario_actual: Usuario = Depends(get_usuario_actual)) -> Usuario:
        if usuario_actual.rol != rol_esperado:
            raise HTTPException(status_code=403, detail="No tienes permisos para esta acción")
        return usuario_actual
    return verificar