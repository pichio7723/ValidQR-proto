from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.roles import Rol
from core.database import get_db
from core.security import requerir_rol, get_usuario_actual
from models.usuario import Usuario
from schemas.salon import SalonCreate, SalonUpdate, SalonOut
from services.salon.salon_service import (
    crear_salon_service, obtener_salon_service, listar_salones_service,
    actualizar_salon_service, eliminar_salon_service,
)

router = APIRouter(prefix="/salones", tags=["salones"])


@router.post("/", response_model=SalonOut)
def crear(datos: SalonCreate, db: Session = Depends(get_db), usuario_actual: Usuario = Depends(requerir_rol(Rol.ADMIN))):
    return crear_salon_service(db, datos)


@router.get("/{salon_id}", response_model=SalonOut)
def obtener(salon_id: int, db: Session = Depends(get_db), usuario_actual: Usuario = Depends(get_usuario_actual)):
    return obtener_salon_service(db, salon_id)


@router.get("/", response_model=list[SalonOut])
def listar(db: Session = Depends(get_db), usuario_actual: Usuario = Depends(get_usuario_actual)):
    return listar_salones_service(db)


@router.put("/{salon_id}", response_model=SalonOut)
def actualizar(salon_id: int, datos: SalonUpdate, db: Session = Depends(get_db), usuario_actual: Usuario = Depends(requerir_rol(Rol.ADMIN))):
    return actualizar_salon_service(db, salon_id, datos)


@router.delete("/{salon_id}", status_code=204)
def eliminar(salon_id: int, db: Session = Depends(get_db), usuario_actual: Usuario = Depends(requerir_rol(Rol.ADMIN))):
    eliminar_salon_service(db, salon_id)