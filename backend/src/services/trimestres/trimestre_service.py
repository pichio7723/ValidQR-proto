from sqlalchemy.orm import Session
from fastapi import HTTPException

from schemas.trimestre import TrimestreCreate, TrimestreUpdate
from repositories.trimestres.trimestre_repository import (
    crear_trimestre, obtener_por_id, obtener_por_nombre,
    listar_trimestres, actualizar_trimestre, eliminar_trimestre,
)


def crear_trimestre_service(db: Session, datos: TrimestreCreate):
    if obtener_por_nombre(db, datos.nombre):
        raise HTTPException(status_code=400, detail="Ya existe un trimestre con ese nombre")
    if datos.fecha_fin <= datos.fecha_inicio:
        raise HTTPException(status_code=400, detail="La fecha de fin debe ser posterior a la de inicio")
    return crear_trimestre(db, datos)


def obtener_trimestre_service(db: Session, trimestre_id: int):
    trimestre = obtener_por_id(db, trimestre_id)
    if not trimestre:
        raise HTTPException(status_code=404, detail="Trimestre no encontrado")
    return trimestre


def listar_trimestres_service(db: Session):
    return listar_trimestres(db)


def actualizar_trimestre_service(db: Session, trimestre_id: int, datos: TrimestreUpdate):
    trimestre = obtener_trimestre_service(db, trimestre_id)
    datos_dict = datos.model_dump(exclude_unset=True)
    return actualizar_trimestre(db, trimestre, datos_dict)


def eliminar_trimestre_service(db: Session, trimestre_id: int):
    trimestre = obtener_trimestre_service(db, trimestre_id)
    eliminar_trimestre(db, trimestre)