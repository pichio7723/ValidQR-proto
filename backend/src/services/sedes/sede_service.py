from sqlalchemy.orm import Session
from fastapi import HTTPException

from schemas.sede import SedeCrear, SedeUpdate
from repositories.sedes.sede_repository import (
    crear_sede,
    obtener_por_id,
    obtener_por_nombre,
    listar_sedes,
    actualizar_sede,
    eliminar_sede,
)


def crear_sede_service(db: Session, sede_data: SedeCrear):
    sede_existente = obtener_por_nombre(db, sede_data.nombre)

    if sede_existente:
        raise HTTPException(
            status_code=400,
            detail="Ya existe una sede con ese nombre"
        )

    return crear_sede(db, sede_data)


def obtener_sede_service(db: Session, sede_id: int):
    sede = obtener_por_id(db, sede_id)

    if not sede:
        raise HTTPException(
            status_code=404,
            detail="Sede no encontrada"
        )

    return sede


def listar_sedes_service(db: Session):
    return listar_sedes(db)


def actualizar_sede_service(
    db: Session,
    sede_id: int,
    datos: SedeUpdate
):
    sede = obtener_sede_service(db, sede_id)

    datos_dict = datos.model_dump(exclude_unset=True)

    return actualizar_sede(db, sede, datos_dict)


def eliminar_sede_service(db: Session, sede_id: int):
    sede = obtener_sede_service(db, sede_id)

    eliminar_sede(db, sede)