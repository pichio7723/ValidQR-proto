from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from schemas.usuario import UsuarioLogin, Token


from core.database import get_db
from schemas.usuario import UsuarioCrear, UsuarioOut, UsuarioUpdate
from services.usuarios.usuario_service import (
    registrar_usuario,
    login_usuario,
    actualizar_usuario_service,
    eliminar_usuario_service,
)

router = APIRouter(prefix="/usuarios", tags=["usuarios"])


@router.post("/registro", response_model=UsuarioOut)
def registro(usuario_data: UsuarioCrear, db: Session = Depends(get_db)):
    return registrar_usuario(db, usuario_data)

@router.put("/{usuario_id}", response_model=UsuarioOut)
def actualizar(
    usuario_id: int,
    datos: UsuarioUpdate,
    db: Session = Depends(get_db)
):
    return actualizar_usuario_service(db, usuario_id, datos)

@router.post("/login", response_model=Token)
def login(credenciales: UsuarioLogin, db: Session = Depends(get_db)):
    return login_usuario(db, credenciales)

@router.delete("/{usuario_id}", status_code=204)
def eliminar(usuario_id: int, db: Session = Depends(get_db)):
    eliminar_usuario_service(db, usuario_id)
    