from datetime import datetime
from zoneinfo import ZoneInfo
from sqlalchemy.orm import Session
from fastapi import HTTPException

from schemas.codigo_qr import CodigoQRCreate
from repositories.horarios.horario_repository import buscar_horario_vigente
from repositories.salon.salon_repository import obtener_por_id as obtener_salon_por_id
from repositories.codigos_qr.codigo_qr_repository import (
    crear_codigo_qr,
    obtener_por_id,
    listar_codigos,
    listar_por_ficha,
    listar_por_instructor,
    eliminar_codigo_qr,
)

DIAS = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"]


def crear_codigo_qr_service(db: Session, instructor_id: int, datos: CodigoQRCreate):
    ahora_bogota = datetime.now(ZoneInfo("America/Bogota"))
    dia_semana = DIAS[ahora_bogota.weekday()]

    horario = buscar_horario_vigente(
        db, instructor_id, datos.ficha_id, dia_semana, ahora_bogota.time(), ahora_bogota.date()
    )
    if not horario:
        raise HTTPException(status_code=403, detail="No tienes clase asignada a esta ficha en este horario")

    salon = obtener_salon_por_id(db, horario.salon_id)

    return crear_codigo_qr(
        db,
        instructor_id=instructor_id,
        ficha_id=datos.ficha_id,
        sede_id=salon.sede_id,
        horario_id=horario.id,
    )


def obtener_codigo_qr_service(db: Session, codigo_id: str):
    codigo = obtener_por_id(db, codigo_id)
    if not codigo:
        raise HTTPException(status_code=404, detail="Código QR no encontrado")
    return codigo


def listar_codigos_service(db: Session):
    return listar_codigos(db)


def listar_codigos_ficha_service(db: Session, ficha_id: int):
    return listar_por_ficha(db, ficha_id)


def listar_codigos_instructor_service(db: Session, instructor_id: int):
    return listar_por_instructor(db, instructor_id)


def eliminar_codigo_qr_service(db: Session, codigo_id: str, instructor_id: int):
    codigo = obtener_codigo_qr_service(db, codigo_id)
    if codigo.instructor_id != instructor_id:
        raise HTTPException(status_code=403, detail="No tienes permisos sobre este código QR")
    eliminar_codigo_qr(db, codigo)