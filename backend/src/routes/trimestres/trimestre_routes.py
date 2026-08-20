from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.roles import Rol
from core.database import get_db
from core.security import requerir_rol, get_usuario_actual
from models.usuario import Usuario
from schemas.trimestre import TrimestreCreate, TrimestreUpdate, TrimestreOut
from services.trimestres.trimestre_service import (
    crear_trimestre_service, obtener_trimestre_service, listar_trimestres_service,
    actualizar_trimestre_service, eliminar_trimestre_service,
)

router = APIRouter(prefix="/trimestres", tags=["trimestres"])


@router.post("/", response_model=TrimestreOut)
def crear(datos: TrimestreCreate, db: Session = Depends(get_db), usuario_actual: Usuario = Depends(requerir_rol(Rol.ADMIN))):
    return crear_trimestre_service(db, datos)


@router.get("/{trimestre_id}", response_model=TrimestreOut)
def obtener(trimestre_id: int, db: Session = Depends(get_db), usuario_actual: Usuario = Depends(get_usuario_actual)):
    return obtener_trimestre_service(db, trimestre_id)


@router.get("/", response_model=list[TrimestreOut])
def listar(db: Session = Depends(get_db), usuario_actual: Usuario = Depends(get_usuario_actual)):
    return listar_trimestres_service(db)


@router.put("/{trimestre_id}", response_model=TrimestreOut)
def actualizar(trimestre_id: int, datos: TrimestreUpdate, db: Session = Depends(get_db), usuario_actual: Usuario = Depends(requerir_rol(Rol.ADMIN))):
    return actualizar_trimestre_service(db, trimestre_id, datos)


@router.delete("/{trimestre_id}", status_code=204)
def eliminar(trimestre_id: int, db: Session = Depends(get_db), usuario_actual: Usuario = Depends(requerir_rol(Rol.ADMIN))):
    eliminar_trimestre_service(db, trimestre_id)