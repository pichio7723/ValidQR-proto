# ValidQR

Sistema para gestión y validación de asistencia mediante códigos QR. El repositorio incluye:

- **Backend**: API REST con FastAPI, SQLAlchemy, Alembic, PostgreSQL y Redis.
- **Frontend web**: aplicación en React + Vite.
- **Frontend móvil**: aplicación en React Native con Expo.
- **Infraestructura local**: `docker-compose.yml` para levantar base de datos, Redis, backend y Adminer.

## Arquitectura y puertos

Servicios definidos en `docker-compose.yml`:

| Servicio | Contenedor | Puerto host | Descripción |
| --- | --- | --- | --- |
| PostgreSQL | `validqr_proto_db` | `5434` | Base de datos principal (mapeado a `5432` interno) |
| Redis | `validqr_proto_redis` | `6380` | Cache/broker (mapeado a `6379` interno) |
| Backend (FastAPI) | `validqr_proto_backend` | `8001` | API en `http://localhost:8001` (mapeado a `8000` interno) |
| Adminer | `validqr_proto_adminer` | `8081` | UI web para BD en `http://localhost:8081` |

> Nota: dentro de la red de Docker el backend se conecta a `db:5432` y `redis:6379` (ver `.env`).

## Requisitos previos (Fedora)

Instala las herramientas necesarias:

```bash
# Actualizar sistema (opcional pero recomendado)
sudo dnf upgrade --refresh -y

# Git y utilidades básicas
sudo dnf install -y git curl

# Docker Engine + Docker Compose plugin
sudo dnf install -y dnf-plugins-core
sudo dnf config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Habilitar e iniciar Docker
sudo systemctl enable --now docker

# (Opcional) usar Docker sin sudo
sudo usermod -aG docker $USER
# Cierra sesión y vuelve a entrar para que tome efecto el grupo docker
```

Para el frontend web/móvil (desarrollo local fuera de Docker):

```bash
# Node.js (LTS recomendado) y npm
sudo dnf install -y nodejs npm

# Verificar versiones
node -v
npm -v
```

Para la app móvil con Expo, también necesitarás en tu equipo/dispositivo:
- **Expo Go** (Android/iOS) o un emulador configurado.
- Opcional: `npx expo` (se usa sin instalación global).

> Python no es obligatorio en el host si usas Docker para el backend, pero puede ser útil para tareas locales.

## Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO> ValidQR-proto
cd ValidQR-proto
```

Reemplaza `<URL_DEL_REPOSITORIO>` por la URL SSH/HTTPS de tu repositorio remoto.

## Configuración de variables de entorno

### 1. Backend e infraestructura (raíz del proyecto)

El `docker-compose.yml` lee variables desde un archivo `.env` en la raíz. Crea/ajusta `./.env` con valores como:

```env
POSTGRES_USER=adminvalidqr
POSTGRES_PASSWORD=validqr123
POSTGRES_DB=validqr_db
DATABASE_URL=postgresql://adminvalidqr:validqr123@db:5432/validqr_db
REDIS_URL=redis://redis:6379/0
SECRET_KEY=cambia_esta_clave_por_una_segura
```

- `DATABASE_URL` debe apuntar al host `db` (nombre del servicio en Docker), no a `localhost`.
- Cambia `SECRET_KEY`, usuario y contraseña en entornos reales.

### 2. Frontend web

La app web usa Vite y espera `VITE_API_URL`. Crea/ajusta `frontend/web/.env`:

```env
VITE_API_URL=http://localhost:8001
VITE_APP_NAME=ValidQR
```

`http://localhost:8001` es el puerto expuesto del backend en tu máquina host.

## Levantar el proyecto con Docker (backend + BD + Redis + Adminer)

Desde la raíz del repositorio:

```bash
# Construir imágenes y levantar servicios
docker compose up -d --build

# Ver estado
docker compose ps

# Ver logs (opcional)
docker compose logs -f backend
```

Una vez arriba:
- API: `http://localhost:8001` (endpoint raíz: `GET /` devuelve estado)
- Adminer: `http://localhost:8081`
  - Sistema: `PostgreSQL`
  - Servidor: `db`
  - Usuario / Contraseña / Base de datos: los definidos en `.env`

### Migraciones de base de datos (Alembic)

El backend incluye `alembic.ini` y carpeta `backend/alembic/`. Si necesitas aplicar migraciones:

```bash
# Ejecutar dentro del contenedor del backend
docker compose exec backend alembic upgrade head
```

Si es la primera vez que configuras el esquema y no existen migraciones generadas/aplicables, revisa la carpeta `backend/alembic` y los modelos en `backend/src` antes de continuar.

### Comandos útiles de Docker

```bash
# Detener servicios
docker compose down

# Detener y eliminar volúmenes (borra datos de PostgreSQL)
docker compose down -v

# Reconstruir solo backend tras cambios en dependencias/Dockerfile
docker compose up -d --build backend
```

## Ejecutar el frontend web (desarrollo local)

En otra terminal:

```bash
cd frontend/web
npm install
npm run dev
```

- Por defecto Vite sirve en `http://localhost:5173`.
- Asegúrate de que el backend esté corriendo y que `VITE_API_URL` apunte a `http://localhost:8001`.
- El backend permite CORS desde `http://localhost:5173` y `http://localhost:3000` (ver `backend/src/main.py`).

Scripts disponibles (`frontend/web/package.json`):
- `npm run dev`: servidor de desarrollo
- `npm run build`: build de producción
- `npm run preview`: previsualización del build
- `npm run lint`: lint con Oxlint

## Ejecutar la app móvil (Expo)

```bash
cd frontend/mobile
npm install
npx expo start
```

Opciones:
- Escanea el QR con **Expo Go** (misma red que tu PC).
- `npm run android` / `npm run ios`: requiere entorno nativo/emulador configurado (`expo run:android|ios`).

> La configuración de la URL del API en móvil puede requerir ajustar el host (por ejemplo, usar la IP local de tu máquina en lugar de `localhost`) para que el dispositivo/emulador pueda alcanzar el backend. Revisa los servicios/archivos de configuración en `frontend/mobile` según tu entorno.

## Desarrollo del backend sin Docker (opcional)

Si prefieres ejecutar FastAPI directamente en tu máquina:

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Ajusta DATABASE_URL/REDIS_URL para apuntar a servicios accesibles desde el host
# (por ejemplo localhost:5434 y localhost:6380 si usas los contenedores de db/redis)
export PYTHONPATH=./src
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

En este modo deberás tener PostgreSQL y Redis disponibles y las variables de entorno correctamente configuradas.

## Estructura del repositorio (resumen)

```text
.
├── backend/                 # API FastAPI, modelos, rutas, servicios, Alembic
│   ├── src/
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── web/                 # React + Vite
│   └── mobile/              # React Native + Expo
├── docs/                    # Documentación (si aplica)
├── docker-compose.yml       # Orquestación local
└── .env                     # Variables para docker-compose/backend (no versionar secretos reales)
```

## Solución de problemas comunes

- **Puertos en uso**: cambia los mapeos en `docker-compose.yml` o libera los puertos `5434`, `6380`, `8001`, `8081`, `5173`.
- **Permisos de Docker en Fedora**: si `docker compose` requiere sudo, asegúrate de haber agregado tu usuario al grupo `docker` y reiniciado la sesión.
- **Backend no conecta a la BD**: verifica que `.env` use `db:5432` y `redis:6379` cuando corre dentro de Docker, y que los contenedores `db`/`redis` estén saludables (`docker compose ps`, `docker compose logs db`).
- **CORS / frontend no llega al API**: confirma `VITE_API_URL` y que el origen del frontend esté permitido en `backend/src/main.py`.
- **Cambios no reflejados en backend (Docker)**: el servicio monta `./backend:/app` y usa `--reload`; si instalaste nuevas dependencias, reconstruye la imagen (`docker compose up -d --build backend`).

