package handler

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/emili/calculator-backend/internal/calculator"
)

type CalculateRequest struct {
	Operation calculator.Operation `json:"operation"`
	A         float64              `json:"a"`
	B         float64              `json:"b"`
}

type CalculateResponse struct {
	Result float64 `json:"result"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}

type CalculatorHandler struct{}

func NewCalculatorHandler() *CalculatorHandler {
	return &CalculatorHandler{}
}

func (h *CalculatorHandler) Calculate(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, ErrorResponse{Error: "method not allowed"})
		return
	}

	var req CalculateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, ErrorResponse{Error: "invalid JSON body"})
		return
	}

	if !req.Operation.Valid() {
		writeJSON(w, http.StatusBadRequest, ErrorResponse{Error: "unknown operation"})
		return
	}

	if req.Operation == calculator.OpSqrt {
		req.B = 0
	}

	result, err := calculator.Evaluate(req.Operation, req.A, req.B)
	if err != nil {
		status := http.StatusBadRequest
		if errors.Is(err, calculator.ErrDivisionByZero) ||
			errors.Is(err, calculator.ErrNegativeSqrt) ||
			errors.Is(err, calculator.ErrInvalidOperand) {
			status = http.StatusUnprocessableEntity
		}
		writeJSON(w, status, ErrorResponse{Error: err.Error()})
		return
	}

	writeJSON(w, http.StatusOK, CalculateResponse{Result: result})
}

func (h *CalculatorHandler) Health(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

func writeJSON(w http.ResponseWriter, status int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}
