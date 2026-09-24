from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from core.roles import Rol
from core.database import get_db
from core.security import requerir_rol, get_usuario_actual
from models.usuario import Usuario
from models.ficha import Ficha
from models.horario import Horario
from schemas.ficha import FichaCreate, FichaUpdate, FichaOut
from schemas.usuario import UsuarioOut  # ✅ Importado para retornar aprendices
from services.fichas.ficha_service import (
    crear_ficha_service, obtener_ficha_service, listar_fichas_service,
    actualizar_ficha_service, eliminar_ficha_service,
)

router = APIRouter(prefix="/fichas", tags=["fichas"])


@router.post("/", response_model=FichaOut)
def crear(ficha_data: FichaCreate, db: Session = Depends(get_db), usuario_actual: Usuario = Depends(requerir_rol(Rol.ADMIN))):
    return crear_ficha_service(db, ficha_data)


# ✅ NUEVO ENDPOINT: Obtener fichas del instructor
#DESPUES CAMBIAR LAS OPERACIONES DE BASE DE DATOS A LA CARPETA REPOSITORY PARA RESPETAR LA ARQUITECTURA DE CAPAS
@router.get("/instructor", response_model=List[FichaOut])
def obtener_fichas_instructor(
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(requerir_rol(Rol.INSTRUCTOR))
):
    """
    Obtiene todas las fichas asignadas al instructor actual.
    """
    fichas = db.query(Ficha).join(
        Horario, Ficha.id == Horario.ficha_id
    ).filter(
        Horario.instructor_id == usuario_actual.id
    ).distinct().all()
    
    return fichas


# ✅ NUEVO ENDPOINT: Obtener aprendices de una ficha
# ️ IMPORTANTE: Va ANTES de /{ficha_id} para que FastAPI no confunda "aprendices" con un ID
#DESPUES CAMBIAR LAS OPERACIONES DE BASE DE DATOS A LA CARPETA REPOSITORY PARA RESPETAR LA ARQUITECTURA DE CAPAS
@router.get("/{ficha_id}/aprendices", response_model=List[UsuarioOut])
def obtener_aprendices_de_ficha(
    ficha_id: int,
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(requerir_rol(Rol.INSTRUCTOR))
):
    """
    Obtiene todos los aprendices asignados a una ficha específica.
    Solo el instructor asignado a esa ficha puede consultarlos.
    """
    # 1. Validar que la ficha exista
    ficha = db.query(Ficha).filter(Ficha.id == ficha_id).first()
    if not ficha:
        raise HTTPException(status_code=404, detail="Ficha no encontrada")
    
    # 2. Validar que el instructor tenga esa ficha asignada (seguridad)
    horario_asignado = db.query(Horario).filter(
        Horario.instructor_id == usuario_actual.id,
        Horario.ficha_id == ficha_id
    ).first()
    
    if not horario_asignado:
        raise HTTPException(
            status_code=403, 
            detail="No tienes autorización para ver los aprendices de esta ficha"
        )
    
    # 3. Obtener los aprendices de esa ficha
    aprendices = db.query(Usuario).filter(
        Usuario.ficha_id == ficha_id,
        Usuario.rol == Rol.APRENDIZ
    ).order_by(Usuario.nombre).all()
    
    return aprendices


@router.get("/{ficha_id}", response_model=FichaOut)
def obtener(ficha_id: int, db: Session = Depends(get_db), usuario_actual: Usuario = Depends(get_usuario_actual)):
    return obtener_ficha_service(db, ficha_id)


@router.get("/", response_model=list[FichaOut])
def listar(db: Session = Depends(get_db)):
    return listar_fichas_service(db)


@router.put("/{ficha_id}", response_model=FichaOut)
def actualizar(ficha_id: int, datos: FichaUpdate, db: Session = Depends(get_db), usuario_actual: Usuario = Depends(requerir_rol(Rol.ADMIN))):
    return actualizar_ficha_service(db, ficha_id, datos)


@router.delete("/{ficha_id}", status_code=204)
def eliminar(ficha_id: int, db: Session = Depends(get_db), usuario_actual: Usuario = Depends(requerir_rol(Rol.ADMIN))):
    eliminar_ficha_service(db, ficha_id)