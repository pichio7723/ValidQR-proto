from fastapi import FastAPI
from routes.usuarios.usuario_routes import router as usuario_router
from routes.fichas.ficha_routes import router as ficha_router
from routes.asistencias.asistencia_routes import router as asistencia_router
from routes.sedes.sede_routes import router as sede_router
from routes.salon.salon_routes import router as salon_router
from routes.franjas_clase.franja_clase_routes import router as franja_router
from routes.trimestres.trimestre_routes import router as trimestre_router
from routes.horarios.horario_routes import router as horario_router
from routes.codigos_qr.codigo_qr_routes import router as codigo_qr_router


app = FastAPI()

@app.get("/")
def read_root():
    return {"mensaje": "ValidQR API funcionando"}

app.include_router(usuario_router)
app.include_router(ficha_router)
app.include_router(asistencia_router)
app.include_router(sede_router)
app.include_router(salon_router)
app.include_router(franja_router)
app.include_router(trimestre_router)
app.include_router(horario_router)
app.include_router(codigo_qr_router)