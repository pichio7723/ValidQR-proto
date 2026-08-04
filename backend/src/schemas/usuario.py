from pydantic import BaseModel, ConfigDict


class UsuarioBase(BaseModel):
    nombre: str
    email: str
    rol: str


class UsuarioCrear(UsuarioBase):
    password: str  # contraseña en texto plano, solo al crear — el service la hashea antes de guardar


class UsuarioUpdate(BaseModel):
    nombre: str | None = None
    email: str | None = None
    password: str | None = None
    rol: str | None = None


class UsuarioOut(UsuarioBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class UsuarioLogin(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"