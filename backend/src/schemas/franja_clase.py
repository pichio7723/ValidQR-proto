from datetime import time
from pydantic import BaseModel, ConfigDict


class FranjaClaseBase(BaseModel):
    hora_inicio: time
    hora_fin: time
    jornada: str


class FranjaClaseCreate(FranjaClaseBase):
    pass


class FranjaClaseUpdate(BaseModel):
    hora_inicio: time | None = None
    hora_fin: time | None = None
    jornada: str | None = None


class FranjaClaseOut(FranjaClaseBase):
    id: int
    model_config = ConfigDict(from_attributes=True)