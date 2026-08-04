from sqlalchemy.orm import Session
from models.usuario import Usuario
from schemas.usuario import UsuarioCrear


def crear_usuario(db: Session, usuario_data: UsuarioCrear, password_hash: str) -> Usuario:
    nuevo_usuario = Usuario(
        nombre=usuario_data.nombre,
        email=usuario_data.email,
        password_hash=password_hash,
        rol=usuario_data.rol,
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    return nuevo_usuario


def obtener_por_email(db: Session, email: str) -> Usuario | None:
    return db.query(Usuario).filter(Usuario.email == email).first()


def obtener_por_id(db: Session, usuario_id: int) -> Usuario | None:
    return db.query(Usuario).filter(Usuario.id == usuario_id).first()

def actualizar_usuario(db: Session, usuario: Usuario, datos: dict) -> Usuario:
    for campo, valor in datos.items():
        setattr(usuario, campo, valor)
    db.commit()
    db.refresh(usuario)
    return usuario

def eliminar_usuario(db: Session, usuario: Usuario) -> None:
    db.delete(usuario)
    db.commit()

