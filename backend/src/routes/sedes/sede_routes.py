from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.roles import Rol
from core.database import get_db
from core.security import requerir_rol
from models.usuario import Usuario
from schemas.sede import SedeCrear, SedeUpdate, SedeOut
from services.sedes.sede_service import (
    crear_sede_service,
    obtener_sede_service,
    listar_sedes_service,
    actualizar_sede_service,
    eliminar_sede_service,
)

router = APIRouter(prefix="/sedes", tags=["sedes"])


# ---------- Lectura (pública o para cualquier rol) ----------

@router.get("/", response_model=list[SedeOut])
def listar(db: Session = Depends(get_db)):
    return listar_sedes_service(db)


@router.get("/{sede_id}", response_model=SedeOut)
def obtener(sede_id: int, db: Session = Depends(get_db)):
    return obtener_sede_service(db, sede_id)


# ---------- Modificaciones: solo administrador ----------

@router.post("/", response_model=SedeOut)
def crear(
    sede_data: SedeCrear,
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(requerir_rol(Rol.ADMIN)),
):
    return crear_sede_service(db, sede_data)


@router.put("/{sede_id}", response_model=SedeOut)
def actualizar(
    sede_id: int,
    datos: SedeUpdate,
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(requerir_rol(Rol.ADMIN)),
):
    return actualizar_sede_service(db, sede_id, datos)


@router.delete("/{sede_id}", status_code=204)
def eliminar(
    sede_id: int,
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(requerir_rol(Rol.ADMIN)),
):
    eliminar_sede_service(db, sede_id)