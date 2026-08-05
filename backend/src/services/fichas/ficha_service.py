from sqlalchemy.orm import Session
from fastapi import HTTPException

from schemas.ficha import FichaCreate, FichaUpdate
from repositories.fichas.ficha_repository import (
    crear_ficha,
    obtener_por_id,
    obtener_por_numero,
    listar_por_instructor,
    actualizar_ficha,
    eliminar_ficha,
)


def crear_ficha_service(db: Session, ficha_data: FichaCreate):
    ficha_existente = obtener_por_numero(db, ficha_data.numero_ficha)
    if ficha_existente:
        raise HTTPException(status_code=400, detail="Ya existe una ficha con ese número")

    return crear_ficha(db, ficha_data)


def obtener_ficha_service(db: Session, ficha_id: int):
    ficha = obtener_por_id(db, ficha_id)
    if not ficha:
        raise HTTPException(status_code=404, detail="Ficha no encontrada")
    return ficha


def listar_fichas_instructor_service(db: Session, instructor_id: int):
    return listar_por_instructor(db, instructor_id)


def actualizar_ficha_service(db: Session, ficha_id: int, datos: FichaUpdate, instructor_id: int):
    ficha = obtener_ficha_service(db, ficha_id)

    if ficha.instructor_id != instructor_id:
        raise HTTPException(status_code=403, detail="No tienes permisos sobre esta ficha")

    datos_dict = datos.model_dump(exclude_unset=True)
    return actualizar_ficha(db, ficha, datos_dict)


def eliminar_ficha_service(db: Session, ficha_id: int, instructor_id: int):
    ficha = obtener_ficha_service(db, ficha_id)

    if ficha.instructor_id != instructor_id:
        raise HTTPException(status_code=403, detail="No tienes permisos sobre esta ficha")

    eliminar_ficha(db, ficha)