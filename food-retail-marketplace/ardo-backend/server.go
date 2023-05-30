package ardo

import (
	"context"
	"fmt"
	"net/http"
	"strconv"
)

type Server struct {
	httpServer *http.Server
}

func (s *Server) Run(port int, handler http.Handler) error {
	s.httpServer = &http.Server{
		Addr:           ":" + strconv.Itoa(port),
		Handler:        handler,
		MaxHeaderBytes: 1 << 20, // 1 MB
	}

	fmt.Printf("\nSERVER STARTED ON PORT: %d\n\n", port)
	return s.httpServer.ListenAndServe()
}

func (s *Server) Shutdown(ctx context.Context) error {
	return s.httpServer.Shutdown(ctx)
}
