from sqlalchemy import Column, Integer, String, ForeignKey
from core.database import Base


class Salon(Base):
    __tablename__ = "salones"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    sede_id = Column(Integer, ForeignKey("sedes.id"), index=True, nullable=False)