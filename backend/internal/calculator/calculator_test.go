package calculator

import (
	"math"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestOperationValid(t *testing.T) {
	assert.True(t, OpAdd.Valid())
	assert.False(t, Operation("noop").Valid())
}

func TestEvaluateBasic(t *testing.T) {
	result, err := Evaluate(OpAdd, 2, 3)
	require.NoError(t, err)
	assert.Equal(t, 5.0, result)

	result, err = Evaluate(OpSubtract, 10, 4)
	require.NoError(t, err)
	assert.Equal(t, 6.0, result)

	result, err = Evaluate(OpMultiply, 3, 7)
	require.NoError(t, err)
	assert.Equal(t, 21.0, result)

	result, err = Evaluate(OpDivide, 8, 2)
	require.NoError(t, err)
	assert.Equal(t, 4.0, result)
}

func TestEvaluateDivideByZero(t *testing.T) {
	_, err := Evaluate(OpDivide, 1, 0)
	assert.ErrorIs(t, err, ErrDivisionByZero)
}

func TestEvaluateAdvanced(t *testing.T) {
	result, err := Evaluate(OpPower, 2, 3)
	require.NoError(t, err)
	assert.Equal(t, 8.0, result)

	result, err = Evaluate(OpSqrt, 9, 0)
	require.NoError(t, err)
	assert.Equal(t, 3.0, result)

	result, err = Evaluate(OpPercent, 20, 50)
	require.NoError(t, err)
	assert.Equal(t, 10.0, result)
}

func TestEvaluateSqrtNegative(t *testing.T) {
	_, err := Evaluate(OpSqrt, -1, 0)
	assert.ErrorIs(t, err, ErrNegativeSqrt)
}

func TestEvaluateInvalidOperand(t *testing.T) {
	_, err := Evaluate(OpAdd, math.NaN(), 1)
	assert.ErrorIs(t, err, ErrInvalidOperand)
}
