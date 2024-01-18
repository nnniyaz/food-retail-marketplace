package middleware

import (
	"github.com/go-chi/chi/v5/middleware"
	"net/http"
)

func GetReqId(r *http.Request) string {
	return middleware.GetReqID(r.Context())
}
