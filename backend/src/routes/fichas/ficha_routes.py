from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.roles import Rol
from core.database import get_db
from core.security import requerir_rol, get_usuario_actual
from models.usuario import Usuario
from schemas.ficha import FichaCreate, FichaUpdate, FichaOut
from services.fichas.ficha_service import (
    crear_ficha_service, obtener_ficha_service, listar_fichas_service,
    actualizar_ficha_service, eliminar_ficha_service,
)

router = APIRouter(prefix="/fichas", tags=["fichas"])


@router.post("/", response_model=FichaOut)
def crear(ficha_data: FichaCreate, db: Session = Depends(get_db), usuario_actual: Usuario = Depends(requerir_rol(Rol.ADMIN))):
    return crear_ficha_service(db, ficha_data)


@router.get("/{ficha_id}", response_model=FichaOut)
def obtener(ficha_id: int, db: Session = Depends(get_db), usuario_actual: Usuario = Depends(get_usuario_actual)):
    return obtener_ficha_service(db, ficha_id)


@router.get("/", response_model=list[FichaOut])
def listar(db: Session = Depends(get_db), usuario_actual: Usuario = Depends(get_usuario_actual)):
    return listar_fichas_service(db)


@router.put("/{ficha_id}", response_model=FichaOut)
def actualizar(ficha_id: int, datos: FichaUpdate, db: Session = Depends(get_db), usuario_actual: Usuario = Depends(requerir_rol(Rol.ADMIN))):
    return actualizar_ficha_service(db, ficha_id, datos)


@router.delete("/{ficha_id}", status_code=204)
def eliminar(ficha_id: int, db: Session = Depends(get_db), usuario_actual: Usuario = Depends(requerir_rol(Rol.ADMIN))):
    eliminar_ficha_service(db, ficha_id)