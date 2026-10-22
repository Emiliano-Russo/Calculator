# Full-stack calculator

A calculator app with a **React (TypeScript)** frontend and a **Go REST microservice** backend. The frontend validates input on the client and delegates arithmetic to the API.

## Repository layout

```
Calculator/
├── backend/          # Go REST API
├── frontend/         # React + Vite UI
├── docker-compose.yml
├── scripts/          # Run tests and coverage
└── README.md
```

## Requirements

- [Go](https://go.dev/) 1.22+
- [Node.js](https://nodejs.org/) 20+
- (Optional) Docker and Docker Compose

## Local development

### Backend

```bash
cd backend
go mod download
go run ./cmd/server
```

The server listens on `http://localhost:8080`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. Vite proxies `/api` and `/health` to the backend on port 8080.

Frontend environment variables:

| Variable       | Description                                      |
|----------------|--------------------------------------------------|
| `VITE_API_URL` | API base URL (empty = same origin / dev proxy)   |

## REST API

### `GET /health`

Checks that the service is up.

**200 response**

```json
{ "status": "ok" }
```

### `POST /api/calculate`

Runs a calculation.

**Request body (JSON)**

| Field       | Type   | Description |
|-------------|--------|-------------|
| `operation` | string | `add`, `subtract`, `multiply`, `divide`, `power`, `sqrt`, `percent` |
| `a`         | number | First operand (or value for `sqrt`) |
| `b`         | number | Second operand (ignored for `sqrt`) |

**Example — addition**

```bash
curl -s -X POST http://localhost:8080/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"operation":"add","a":2,"b":3}'
```

```json
{ "result": 5 }
```

**Example — division by zero (422)**

```json
{ "error": "division by zero" }
```

**Operation semantics**

- **percent**: `result = (a / 100) * b` (e.g. 20% of 50 → 10).
- **sqrt**: only `a` is used; it must be ≥ 0.

## Tests and coverage

### Backend

```bash
cd backend
go test ./... -coverprofile=coverage.out
go tool cover -html=coverage.out -o coverage.html
```

If Go is not installed locally, you can use the official image:

```bash
docker run --rm -v "%cd%:/app" -w /app golang:1.22-alpine go test ./... -coverprofile=coverage.out
```

### Frontend

```bash
cd frontend
npm run test:coverage
```

Reports are written to `frontend/coverage/`.

### Entire project (Windows)

```powershell
.\scripts\test-all.ps1
```

## Docker (optional)

```bash
docker compose up --build
```

- Frontend: `http://localhost:3000` (nginx serves the SPA and proxies to the API).
- Backend: `http://localhost:8080`.

## Design decisions

1. **Go domain layer** (`internal/calculator`): pure logic, no HTTP, easy to unit test.
2. **Single endpoint** `POST /api/calculate`: the client sends operation and operands; avoids route sprawl and keeps the contract stable.
3. **Two-layer validation**: the frontend gives immediate feedback; the backend rejects invalid data and edge cases such as division by zero or negative square roots (422).
4. **Thin frontend**: `calculatorApi` wraps HTTP; `validation` holds UI rules and numeric input sanitization; `App` only orchestrates state.
5. **CORS** on the backend for local development and deployments where the UI does not share the API origin.

## License

Educational / demonstration use.
