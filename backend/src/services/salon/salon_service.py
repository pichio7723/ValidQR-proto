from sqlalchemy.orm import Session
from fastapi import HTTPException

from schemas.salon import SalonCreate, SalonUpdate
from repositories.salon.salon_repository import (
    crear_salon, obtener_por_id, listar_salones, actualizar_salon, eliminar_salon,
)
from repositories.sedes.sede_repository import obtener_por_id as obtener_sede_por_id


def crear_salon_service(db: Session, datos: SalonCreate):
    if not obtener_sede_por_id(db, datos.sede_id):
        raise HTTPException(status_code=404, detail="La sede indicada no existe")
    return crear_salon(db, datos)


def obtener_salon_service(db: Session, salon_id: int):
    salon = obtener_por_id(db, salon_id)
    if not salon:
        raise HTTPException(status_code=404, detail="Salón no encontrado")
    return salon


def listar_salones_service(db: Session):
    return listar_salones(db)


def actualizar_salon_service(db: Session, salon_id: int, datos: SalonUpdate):
    salon = obtener_salon_service(db, salon_id)
    datos_dict = datos.model_dump(exclude_unset=True)
    return actualizar_salon(db, salon, datos_dict)


def eliminar_salon_service(db: Session, salon_id: int):
    salon = obtener_salon_service(db, salon_id)
    eliminar_salon(db, salon)