from pydantic import BaseModel, ConfigDict
from datetime import datetime

class CodigoQRBase(BaseModel):
    instructor_id: int
    ficha_id: int
    sede_id: int

class CodigoQRCreate(CodigoQRBase):
    pass

class CodigoQRout(CodigoQRBase):
    id: str

    expiracion: datetime

    model_config = ConfigDict(from_attributes=True)