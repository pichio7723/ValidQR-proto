from sqlalchemy import Column, Integer, String, Date
from core.database import Base


class Trimestre(Base):
    __tablename__ = "trimestres"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False, unique=True)
    fecha_inicio = Column(Date, nullable=False)
    fecha_fin = Column(Date, nullable=False)