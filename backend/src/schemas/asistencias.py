from pydantic import BaseModel, ConfigDict
from datetime import datetime


class AsistenciaBase(BaseModel):
    aprendiz_id: int
    ficha_id: int
    sede_id: int
    codigo_id: str
    
class AsistenciaCreate(AsistenciaBase):
    pass

class EscanearQR(BaseModel):
    codigo_id: str
    aprendiz_id: int
    latitud: float
    longitud: float

class AsistenciaOut(AsistenciaBase):
    id: int

    creacion: datetime

    model_config = ConfigDict(from_attributes=True)