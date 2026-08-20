from sqlalchemy import Column, ForeignKey, Integer, String, DateTime
from datetime import datetime, timedelta, timezone
from core.database import Base
import uuid

class CodigoQR(Base):
    __tablename__ = "codigos_qr"

    id = Column(String,primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    instructor_id = Column(Integer, ForeignKey("usuarios.id"), index=True, nullable=False) 
    ficha_id = Column(Integer, ForeignKey("fichas.id"), index=True, nullable=False)
    sede_id = Column(Integer, ForeignKey("sedes.id"), index=True, nullable=False)
    expiracion = Column(DateTime, default=lambda: datetime.now(timezone.utc) + timedelta(minutes=5), nullable=False)
    horario_id = Column(Integer, ForeignKey("horarios.id"), index=True, nullable=False)


