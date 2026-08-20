from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.database import get_db
from core.security import requerir_rol, get_usuario_actual
from core.roles import Rol
from models.usuario import Usuario

from schemas.codigo_qr import CodigoQRCreate, CodigoQROut
from services.codigos_qr.codigo_qr_service import (
    crear_codigo_qr_service,
    obtener_codigo_qr_service,
    listar_codigos_service,
    listar_codigos_ficha_service,
    listar_codigos_instructor_service,
    eliminar_codigo_qr_service,
)

router = APIRouter(prefix="/codigos_qr", tags=["Codigos QR"])


@router.post("/", response_model=CodigoQROut)
def crear_codigo(
    codigo: CodigoQRCreate,
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(requerir_rol(Rol.INSTRUCTOR)),
):
    return crear_codigo_qr_service(db, usuario_actual.id, codigo)


@router.get("/", response_model=list[CodigoQROut])
def listar_codigos(db: Session = Depends(get_db), usuario_actual: Usuario = Depends(get_usuario_actual)):
    return listar_codigos_service(db)


@router.get("/{codigo_id}", response_model=CodigoQROut)
def obtener_codigo(codigo_id: str, db: Session = Depends(get_db), usuario_actual: Usuario = Depends(get_usuario_actual)):
    return obtener_codigo_qr_service(db, codigo_id)


@router.get("/ficha/{ficha_id}", response_model=list[CodigoQROut])
def listar_por_ficha(ficha_id: int, db: Session = Depends(get_db), usuario_actual: Usuario = Depends(get_usuario_actual)):
    return listar_codigos_ficha_service(db, ficha_id)


@router.get("/instructor/{instructor_id}", response_model=list[CodigoQROut])
def listar_por_instructor(instructor_id: int, db: Session = Depends(get_db), usuario_actual: Usuario = Depends(get_usuario_actual)):
    return listar_codigos_instructor_service(db, instructor_id)


@router.delete("/{codigo_id}")
def eliminar_codigo(
    codigo_id: str,
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(requerir_rol(Rol.INSTRUCTOR)),
):
    eliminar_codigo_qr_service(db, codigo_id, usuario_actual.id)
    return {"mensaje": "Código QR eliminado correctamente"}