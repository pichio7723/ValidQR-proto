from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.roles import Rol
from core.database import get_db
from core.security import requerir_rol, get_usuario_actual
from models.usuario import Usuario
from schemas.franja_clase import FranjaClaseCreate, FranjaClaseUpdate, FranjaClaseOut
from services.franjas_clase.franja_clase_service import (
    crear_franja_service, obtener_franja_service, listar_franjas_service,
    actualizar_franja_service, eliminar_franja_service,
)

router = APIRouter(prefix="/franjas_clase", tags=["franjas_clase"])


@router.post("/", response_model=FranjaClaseOut)
def crear(datos: FranjaClaseCreate, db: Session = Depends(get_db), usuario_actual: Usuario = Depends(requerir_rol(Rol.ADMIN))):
    return crear_franja_service(db, datos)


@router.get("/{franja_id}", response_model=FranjaClaseOut)
def obtener(franja_id: int, db: Session = Depends(get_db), usuario_actual: Usuario = Depends(get_usuario_actual)):
    return obtener_franja_service(db, franja_id)


@router.get("/", response_model=list[FranjaClaseOut])
def listar(db: Session = Depends(get_db), usuario_actual: Usuario = Depends(get_usuario_actual)):
    return listar_franjas_service(db)


@router.put("/{franja_id}", response_model=FranjaClaseOut)
def actualizar(franja_id: int, datos: FranjaClaseUpdate, db: Session = Depends(get_db), usuario_actual: Usuario = Depends(requerir_rol(Rol.ADMIN))):
    return actualizar_franja_service(db, franja_id, datos)


@router.delete("/{franja_id}", status_code=204)
def eliminar(franja_id: int, db: Session = Depends(get_db), usuario_actual: Usuario = Depends(requerir_rol(Rol.ADMIN))):
    eliminar_franja_service(db, franja_id)