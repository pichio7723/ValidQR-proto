from sqlalchemy import Column, Integer, String, Time
from core.database import Base


class FranjaClase(Base):
    __tablename__ = "franjas_clase"

    id = Column(Integer, primary_key=True, index=True)
    hora_inicio = Column(Time, nullable=False)
    hora_fin = Column(Time, nullable=False)
    jornada = Column(String, nullable=False)