from sqlalchemy.orm import Session
from fastapi import HTTPException

from schemas.franja_clase import FranjaClaseCreate, FranjaClaseUpdate
from repositories.franjas_clase.franja_clase_repository import (
    crear_franja, obtener_por_id, listar_franjas, actualizar_franja, eliminar_franja,
)


def crear_franja_service(db: Session, datos: FranjaClaseCreate):
    if datos.hora_fin <= datos.hora_inicio:
        raise HTTPException(status_code=400, detail="La hora de fin debe ser posterior a la de inicio")
    return crear_franja(db, datos)


def obtener_franja_service(db: Session, franja_id: int):
    franja = obtener_por_id(db, franja_id)
    if not franja:
        raise HTTPException(status_code=404, detail="Franja de clase no encontrada")
    return franja


def listar_franjas_service(db: Session):
    return listar_franjas(db)


def actualizar_franja_service(db: Session, franja_id: int, datos: FranjaClaseUpdate):
    franja = obtener_franja_service(db, franja_id)
    datos_dict = datos.model_dump(exclude_unset=True)
    return actualizar_franja(db, franja, datos_dict)


def eliminar_franja_service(db: Session, franja_id: int):
    franja = obtener_franja_service(db, franja_id)
    eliminar_franja(db, franja)