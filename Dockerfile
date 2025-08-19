# ---------- Build frontend ----------
FROM node:20-alpine AS frontend
WORKDIR /app
# install deps
COPY frontend/package.json frontend/package-lock.json* /app/
RUN npm install
# build
COPY frontend/ /app
# bake API base as /api (same origin)
ARG VITE_API_BASE=/api
ENV VITE_API_BASE=$VITE_API_BASE
RUN npm run build

# ---------- Build backend runtime ----------
FROM python:3.11-slim AS backend
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1
WORKDIR /app

# system packages if needed (uncomment if you use them)
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     curl netcat-traditional && rm -rf /var/lib/apt/lists/*

# install python deps
COPY backend/app/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# copy backend code
COPY backend/app/ /app/

# copy frontend build into /app/static
COPY --from=frontend /app/dist /app/static

# make a writable data dir
RUN mkdir -p /app/data

# runtime env (you can override in Portainer)
ENV TZ=Europe/Amsterdam \
    PRINTER_IP=192.168.2.34 \
    PRINTER_PORT=9100

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
