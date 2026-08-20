from pydantic import BaseModel, ConfigDict


class FichaBase(BaseModel):
    numero_ficha: int
    nombre_programa: str


class FichaCreate(FichaBase):
    pass


class FichaUpdate(BaseModel):
    numero_ficha: int | None = None
    nombre_programa: str | None = None


class FichaOut(FichaBase):
    id: int
    model_config = ConfigDict(from_attributes=True)