from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.roles import Rol
from core.database import get_db
from core.security import requerir_rol, get_usuario_actual
from models.usuario import Usuario
from schemas.horario import HorarioCreate, HorarioUpdate, HorarioOut
from services.horarios.horario_service import (
    crear_horario_service, obtener_horario_service, listar_horarios_service,
    actualizar_horario_service, eliminar_horario_service,
)

router = APIRouter(prefix="/horarios", tags=["horarios"])


@router.post("/", response_model=HorarioOut)
def crear(datos: HorarioCreate, db: Session = Depends(get_db), usuario_actual: Usuario = Depends(requerir_rol(Rol.ADMIN))):
    return crear_horario_service(db, datos)


@router.get("/{horario_id}", response_model=HorarioOut)
def obtener(horario_id: int, db: Session = Depends(get_db), usuario_actual: Usuario = Depends(get_usuario_actual)):
    return obtener_horario_service(db, horario_id)


@router.get("/", response_model=list[HorarioOut])
def listar(db: Session = Depends(get_db), usuario_actual: Usuario = Depends(get_usuario_actual)):
    return listar_horarios_service(db)


@router.patch("/{horario_id}", response_model=HorarioOut)
def actualizar(horario_id: int, datos: HorarioUpdate, db: Session = Depends(get_db), usuario_actual: Usuario = Depends(requerir_rol(Rol.ADMIN))):
    return actualizar_horario_service(db, horario_id, datos)


@router.delete("/{horario_id}", status_code=204)
def eliminar(horario_id: int, db: Session = Depends(get_db), usuario_actual: Usuario = Depends(requerir_rol(Rol.ADMIN))):
    eliminar_horario_service(db, horario_id)