# Calculadora full-stack

Aplicación de calculadora con **React (TypeScript)** en el frontend y un **microservicio REST en Go** en el backend. El frontend valida entradas en el cliente y delega el cálculo al API.

## Estructura del repositorio

```
Calculator/
├── backend/          # API REST en Go
├── frontend/         # UI React + Vite
├── docker-compose.yml
├── scripts/          # Ejecutar tests y cobertura
└── README.md
```

## Requisitos

- [Go](https://go.dev/) 1.22+
- [Node.js](https://nodejs.org/) 20+
- (Opcional) Docker y Docker Compose

## Desarrollo local

### Backend

```bash
cd backend
go mod download
go run ./cmd/server
```

El servidor escucha en `http://localhost:8080`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Abre `http://localhost:5173`. Vite hace proxy de `/api` y `/health` al backend en el puerto 8080.

Variables de entorno del frontend:

| Variable        | Descripción                                      |
|-----------------|--------------------------------------------------|
| `VITE_API_URL`  | Base URL del API (vacío = mismo origen / proxy) |

## API REST

### `GET /health`

Comprueba que el servicio está activo.

**Respuesta 200**

```json
{ "status": "ok" }
```

### `POST /api/calculate`

Ejecuta una operación.

**Cuerpo (JSON)**

| Campo        | Tipo   | Descripción |
|--------------|--------|-------------|
| `operation`  | string | `add`, `subtract`, `multiply`, `divide`, `power`, `sqrt`, `percent` |
| `a`          | number | Primer operand (o valor para `sqrt`) |
| `b`          | number | Segundo operand (ignorado en `sqrt`) |

**Ejemplo — suma**

```bash
curl -s -X POST http://localhost:8080/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"operation":"add","a":2,"b":3}'
```

```json
{ "result": 5 }
```

**Ejemplo — división por cero (422)**

```json
{ "error": "division by zero" }
```

**Semántica de operaciones**

- **percent**: `result = (a / 100) * b` (por ejemplo, 20 % de 50 → 10).
- **sqrt**: solo se usa `a`; debe ser ≥ 0.

## Tests y cobertura

### Backend

```bash
cd backend
go test ./... -coverprofile=coverage.out
go tool cover -html=coverage.out -o coverage.html
```

Si no tenés Go instalado localmente, podés usar la imagen oficial:

```bash
docker run --rm -v "%cd%:/app" -w /app golang:1.22-alpine go test ./... -coverprofile=coverage.out
```

### Frontend

```bash
cd frontend
npm run test:coverage
```

Los informes quedan en `frontend/coverage/`.

### Todo el proyecto (Windows)

```powershell
.\scripts\test-all.ps1
```

## Docker (opcional)

```bash
docker compose up --build
```

- Frontend: `http://localhost:3000` (nginx sirve la SPA y hace proxy al API).
- Backend: `http://localhost:8080`.

## Decisiones de diseño

1. **Capa de dominio en Go** (`internal/calculator`): lógica pura, sin HTTP, fácil de testear.
2. **Un único endpoint** `POST /api/calculate`: el cliente envía la operación y operands; evita proliferar rutas y mantiene el contrato estable.
3. **Validación en dos capas**: el frontend da feedback inmediato; el backend rechaza datos inválidos y casos como división por cero o raíz de negativo (422).
4. **Frontend delgado**: `calculatorApi` encapsula HTTP; `validation` concentra reglas de UI; `App` solo orquesta estado.
5. **CORS** en el backend para desarrollo y despliegues donde el front no pase por el mismo proxy.

## Licencia

Uso educativo / demostración.
