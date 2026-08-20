from sqlalchemy import Column, Integer, String, ForeignKey
from core.database import Base


class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    password_hash = Column(String, nullable=False)
    rol = Column(String, nullable=False)
    ficha_id = Column(Integer, ForeignKey("fichas.id"), nullable=True, index=True)