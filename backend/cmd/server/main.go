package main

import (
	"log"
	"net/http"
	"os"

	"github.com/emili/calculator-backend/internal/handler"
	"github.com/emili/calculator-backend/internal/middleware"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	calc := handler.NewCalculatorHandler()
	mux := http.NewServeMux()
	mux.HandleFunc("/health", calc.Health)
	mux.HandleFunc("/api/calculate", calc.Calculate)

	addr := ":" + port
	log.Printf("calculator API listening on %s", addr)
	if err := http.ListenAndServe(addr, middleware.CORS(mux)); err != nil {
		log.Fatal(err)
	}
}
