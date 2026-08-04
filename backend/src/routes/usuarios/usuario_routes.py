from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from schemas.usuario import UsuarioLogin, Token

from core.database import get_db
from schemas.usuario import UsuarioCrear, UsuarioOut
from services.usuarios.usuario_service import registrar_usuario
from services.usuarios.usuario_service import login_usuario
from services.usuarios.usuario_service import eliminar_usuario_service

router = APIRouter(prefix="/usuarios", tags=["usuarios"])


@router.post("/registro", response_model=UsuarioOut)
def registro(usuario_data: UsuarioCrear, db: Session = Depends(get_db)):
    return registrar_usuario(db, usuario_data)

@router.post("/login", response_model=Token)
def login(credenciales: UsuarioLogin, db: Session = Depends(get_db)):
    return login_usuario(db, credenciales)

@router.delete("/{usuario_id}", status_code=204)
def eliminar(usuario_id: int, db: Session = Depends(get_db)):
    eliminar_usuario_service(db, usuario_id)