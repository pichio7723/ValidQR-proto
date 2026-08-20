from datetime import datetime
from pydantic import BaseModel, ConfigDict


class CodigoQRBase(BaseModel):
    instructor_id: int  # temporal, hasta que conectemos el JWT
    ficha_id: int


class CodigoQRCreate(CodigoQRBase):
    pass


class CodigoQROut(BaseModel):
    id: str
    instructor_id: int
    ficha_id: int
    sede_id: int
    horario_id: int
    expiracion: datetime

    model_config = ConfigDict(from_attributes=True)