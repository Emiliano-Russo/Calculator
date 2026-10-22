package handler

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestCalculateSuccess(t *testing.T) {
	h := NewCalculatorHandler()
	body := bytes.NewBufferString(`{"operation":"add","a":2,"b":3}`)
	req := httptest.NewRequest(http.MethodPost, "/api/calculate", body)
	rec := httptest.NewRecorder()

	h.Calculate(rec, req)

	require.Equal(t, http.StatusOK, rec.Code)
	var resp CalculateResponse
	require.NoError(t, json.NewDecoder(rec.Body).Decode(&resp))
	assert.Equal(t, 5.0, resp.Result)
}

func TestCalculateDivisionByZero(t *testing.T) {
	h := NewCalculatorHandler()
	body := bytes.NewBufferString(`{"operation":"divide","a":1,"b":0}`)
	req := httptest.NewRequest(http.MethodPost, "/api/calculate", body)
	rec := httptest.NewRecorder()

	h.Calculate(rec, req)

	assert.Equal(t, http.StatusUnprocessableEntity, rec.Code)
}

func TestCalculateInvalidOperation(t *testing.T) {
	h := NewCalculatorHandler()
	body := bytes.NewBufferString(`{"operation":"noop","a":1,"b":2}`)
	req := httptest.NewRequest(http.MethodPost, "/api/calculate", body)
	rec := httptest.NewRecorder()

	h.Calculate(rec, req)

	assert.Equal(t, http.StatusBadRequest, rec.Code)
}

func TestCalculateMethodNotAllowed(t *testing.T) {
	h := NewCalculatorHandler()
	req := httptest.NewRequest(http.MethodGet, "/api/calculate", nil)
	rec := httptest.NewRecorder()

	h.Calculate(rec, req)

	assert.Equal(t, http.StatusMethodNotAllowed, rec.Code)
}

func TestHealth(t *testing.T) {
	h := NewCalculatorHandler()
	req := httptest.NewRequest(http.MethodGet, "/health", nil)
	rec := httptest.NewRecorder()

	h.Health(rec, req)

	assert.Equal(t, http.StatusOK, rec.Code)
}
