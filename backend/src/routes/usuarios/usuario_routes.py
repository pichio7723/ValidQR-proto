from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from schemas.usuario import UsuarioLogin, Token, UsuarioCrear, UsuarioOut, UsuarioUpdate
from core.database import get_db
from core.security import get_usuario_actual
from models.usuario import Usuario
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


@router.get("/me", response_model=UsuarioOut)
def obtener_usuario_actual(usuario: Usuario = Depends(get_usuario_actual)):
    return usuario


@router.get("/instructores", response_model=list[UsuarioOut])
def listar_instructores(
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(get_usuario_actual)
):
    instructores = db.query(Usuario).filter(
        Usuario.rol == "instructor"
    ).all()
    return instructores