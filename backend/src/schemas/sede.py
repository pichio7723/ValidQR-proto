from pydantic import BaseModel, ConfigDict


class SedeBase(BaseModel):
    nombre: str
    latitud: float
    longitud: float
    radio_metros: int
    direccion: str


class SedeCrear(SedeBase):
    pass


class SedeUpdate(BaseModel):
    nombre: str | None = None
    latitud: float | None = None
    longitud: float | None = None
    radio_metros: int | None = None
    direccion: str | None = None


class SedeOut(SedeBase):
    id: int

    model_config = ConfigDict(from_attributes=True)