from sqlalchemy.orm import Session
from fastapi import HTTPException

from schemas.horario import HorarioCreate, HorarioUpdate
from repositories.horarios.horario_repository import (
    crear_horario, obtener_por_id, listar_horarios, actualizar_horario, eliminar_horario,
)

DIAS_VALIDOS = {"lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"}


def crear_horario_service(db: Session, datos: HorarioCreate):
    if datos.dia_semana not in DIAS_VALIDOS:
        raise HTTPException(status_code=400, detail="Día de la semana inválido")
    return crear_horario(db, datos)


def obtener_horario_service(db: Session, horario_id: int):
    horario = obtener_por_id(db, horario_id)
    if not horario:
        raise HTTPException(status_code=404, detail="Horario no encontrado")
    return horario


def listar_horarios_service(db: Session):
    return listar_horarios(db)


def actualizar_horario_service(db: Session, horario_id: int, datos: HorarioUpdate):
    horario = obtener_horario_service(db, horario_id)
    datos_dict = datos.model_dump(exclude_unset=True)
    return actualizar_horario(db, horario, datos_dict)


def eliminar_horario_service(db: Session, horario_id: int):
    horario = obtener_horario_service(db, horario_id)
    eliminar_horario(db, horario)