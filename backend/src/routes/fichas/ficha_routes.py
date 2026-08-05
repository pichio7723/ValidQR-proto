from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.database import get_db
from schemas.ficha import FichaCreate, FichaUpdate, FichaOut
from services.fichas.ficha_service import (
    crear_ficha_service,
    obtener_ficha_service,
    listar_fichas_instructor_service,
    actualizar_ficha_service,
    eliminar_ficha_service,
)

router = APIRouter(prefix="/fichas", tags=["fichas"])


@router.post("/", response_model=FichaOut)
def crear(ficha_data: FichaCreate, db: Session = Depends(get_db)):
    return crear_ficha_service(db, ficha_data)


@router.get("/{ficha_id}", response_model=FichaOut)
def obtener(ficha_id: int, db: Session = Depends(get_db)):
    return obtener_ficha_service(db, ficha_id)

@router.get("/", response_model=list[FichaOut])
def listar(instructor_id: int, db: Session = Depends(get_db)):
    return listar_fichas_instructor_service(db, instructor_id)


#put y delete piden instructor_id como parametro suelto, esto es peligroso, por lo tanto mas adelante se debe tener en cuenta tomar el id de el instructor desde el JWT

@router.put("/{ficha_id}", response_model=FichaOut)
def actualizar(ficha_id: int, datos: FichaUpdate, instructor_id: int, db: Session = Depends(get_db)):
    return actualizar_ficha_service(db, ficha_id, datos, instructor_id)


@router.delete("/{ficha_id}", status_code=204)
def eliminar(ficha_id: int, instructor_id: int, db: Session = Depends(get_db)):
    eliminar_ficha_service(db, ficha_id, instructor_id)