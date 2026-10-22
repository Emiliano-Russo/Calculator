package calculator

import (
	"errors"
	"fmt"
	"math"
)

var (
	ErrDivisionByZero = errors.New("division by zero")
	ErrInvalidOperand = errors.New("invalid operand")
	ErrNegativeSqrt   = errors.New("square root of negative number")
)

type Operation string

const (
	OpAdd      Operation = "add"
	OpSubtract Operation = "subtract"
	OpMultiply Operation = "multiply"
	OpDivide   Operation = "divide"
	OpPower    Operation = "power"
	OpSqrt     Operation = "sqrt"
	OpPercent  Operation = "percent"
)

func (o Operation) Valid() bool {
	switch o {
	case OpAdd, OpSubtract, OpMultiply, OpDivide, OpPower, OpSqrt, OpPercent:
		return true
	default:
		return false
	}
}

func Evaluate(op Operation, a, b float64) (float64, error) {
	if math.IsNaN(a) || math.IsNaN(b) || math.IsInf(a, 0) || math.IsInf(b, 0) {
		return 0, ErrInvalidOperand
	}

	switch op {
	case OpAdd:
		return a + b, nil
	case OpSubtract:
		return a - b, nil
	case OpMultiply:
		return a * b, nil
	case OpDivide:
		if b == 0 {
			return 0, ErrDivisionByZero
		}
		return a / b, nil
	case OpPower:
		return math.Pow(a, b), nil
	case OpSqrt:
		if a < 0 {
			return 0, ErrNegativeSqrt
		}
		return math.Sqrt(a), nil
	case OpPercent:
		return (a / 100) * b, nil
	default:
		return 0, fmt.Errorf("unsupported operation: %s", op)
	}
}
