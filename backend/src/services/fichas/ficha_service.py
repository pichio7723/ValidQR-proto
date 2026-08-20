from sqlalchemy.orm import Session
from fastapi import HTTPException

from schemas.ficha import FichaCreate, FichaUpdate
from repositories.fichas.ficha_repository import (
    crear_ficha, obtener_por_id, obtener_por_numero, listar_todas, actualizar_ficha, eliminar_ficha,
)


def crear_ficha_service(db: Session, ficha_data: FichaCreate):
    if obtener_por_numero(db, ficha_data.numero_ficha):
        raise HTTPException(status_code=400, detail="Ya existe una ficha con ese número")
    return crear_ficha(db, ficha_data)


def obtener_ficha_service(db: Session, ficha_id: int):
    ficha = obtener_por_id(db, ficha_id)
    if not ficha:
        raise HTTPException(status_code=404, detail="Ficha no encontrada")
    return ficha


def listar_fichas_service(db: Session):
    return listar_todas(db)


def actualizar_ficha_service(db: Session, ficha_id: int, datos: FichaUpdate):
    ficha = obtener_ficha_service(db, ficha_id)
    datos_dict = datos.model_dump(exclude_unset=True)
    return actualizar_ficha(db, ficha, datos_dict)


def eliminar_ficha_service(db: Session, ficha_id: int):
    ficha = obtener_ficha_service(db, ficha_id)
    eliminar_ficha(db, ficha)