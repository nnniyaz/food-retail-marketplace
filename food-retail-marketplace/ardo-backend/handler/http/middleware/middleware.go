package middleware

import (
	"context"
	"fmt"
	"github.com/go-chi/chi/v5/middleware"
	"github/nnniyaz/ardo/domain/user/valueobject"
	"github/nnniyaz/ardo/handler/http/response"
	"github/nnniyaz/ardo/pkg/core"
	"github/nnniyaz/ardo/pkg/logger"
	"github/nnniyaz/ardo/pkg/web"
	"github/nnniyaz/ardo/service/auth"
	"go.mongodb.org/mongo-driver/mongo"
	"go.uber.org/zap"
	"net/http"
)

var (
	ErrDoNotHaveAnAccess = core.NewI18NError(core.EFORBIDDEN, core.TXT_DO_NOT_HAVE_AN_ACCESS)
)

type Middleware struct {
	client  *mongo.Client
	service auth.AuthService
	logger  logger.Logger
}

func New(c *mongo.Client, s auth.AuthService, l logger.Logger) *Middleware {
	return &Middleware{client: c, service: s, logger: l}
}

func (m *Middleware) Recover(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if err := recover(); err != nil {
				if e, ok := err.(error); ok {
					response.NewInternal(m.logger, w, r, e, zap.Any("panic", err))
				} else {
					response.NewInternal(m.logger, w, r, nil, zap.Any("panic", err))
				}
			}
		}()
		next.ServeHTTP(w, r)
	})
}

func (m *Middleware) Trace(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		traceId := web.GenerateTraceId()
		ctx := context.WithValue(r.Context(), "traceId", traceId)
		ctx = context.WithValue(ctx, middleware.RequestIDKey, traceId)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (m *Middleware) RequestInfo(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "requestInfo", web.GetRequestInfo(r))
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (m *Middleware) WithTransaction(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost || r.Method == http.MethodPut || r.Method == http.MethodPatch || r.Method == http.MethodDelete {
			session, err := m.client.StartSession()
			if err != nil {
				response.NewError(m.logger, w, r, err)
				return
			}
			defer session.EndSession(r.Context())

			_, err = session.WithTransaction(r.Context(), func(sessCtx mongo.SessionContext) (interface{}, error) {
				ww := middleware.NewWrapResponseWriter(w, r.ProtoMajor)

				next.ServeHTTP(ww, r.WithContext(sessCtx))

				if ww.Status() >= 400 {
					return nil, fmt.Errorf("status code %d", ww.Status())
				}

				return nil, nil
			})
			if err != nil {
				m.logger.Error("error while executing transaction", zap.Error(err))
				return
			}
		} else {
			next.ServeHTTP(w, r)
		}
	})
}

func (m *Middleware) ConfirmationLink(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		link := getParam(r, "link")
		ctx := context.WithValue(r.Context(), "confirmationLink", link)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (m *Middleware) PaginationParams(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		limit, err := getParamInt64(r, "limit")
		if err != nil {
			limit = 25
		}

		offset, err := getParamInt64(r, "offset")
		if err != nil {
			offset = 0
		}

		isDeleted, err := getParamBool(r, "is_deleted")
		if err != nil {
			isDeleted = false
		}

		search := getParam(r, "search")

		ctx := context.WithValue(r.Context(), "limit", limit)
		ctx = context.WithValue(ctx, "offset", offset)
		ctx = context.WithValue(ctx, "is_deleted", isDeleted)
		ctx = context.WithValue(ctx, "search", search)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

func (m *Middleware) UserAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		session, err := r.Cookie("session")
		if err != nil {
			response.NewUnauthorized(m.logger, w, r)
			return
		}

		requestInfo := r.Context().Value("requestInfo").(web.RequestInfo)

		u, err := m.service.UserCheck(r.Context(), session.Value, requestInfo.UserAgent.String)
		if err != nil {
			response.NewError(m.logger, w, r, err)
			return
		}

		ctx := context.WithValue(r.Context(), "sessionKey", session.Value)
		ctx = context.WithValue(ctx, "user", *u)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (m *Middleware) ClientAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		session, err := r.Cookie("session")
		if err != nil {
			response.NewUnauthorized(m.logger, w, r)
			return
		}

		requestInfo := r.Context().Value("requestInfo").(web.RequestInfo)

		u, err := m.service.UserCheck(r.Context(), session.Value, requestInfo.UserAgent.String)
		if err != nil {
			response.NewError(m.logger, w, r, err)
			return
		}

		allowedUserTypes := map[valueobject.UserType]bool{
			valueobject.UserTypeAdmin:     false,
			valueobject.UserTypeModerator: false,
			valueobject.UserTypeClient:    true,
		}

		if !allowedUserTypes[u.GetUserType()] {
			response.NewError(m.logger, w, r, ErrDoNotHaveAnAccess)
			return
		}

		ctx := context.WithValue(r.Context(), "sessionKey", session.Value)
		ctx = context.WithValue(ctx, "user", *u)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (m *Middleware) StaffAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		session, err := r.Cookie("session")
		if err != nil {
			response.NewUnauthorized(m.logger, w, r)
			return
		}

		requestInfo := r.Context().Value("requestInfo").(web.RequestInfo)

		u, err := m.service.UserCheck(r.Context(), session.Value, requestInfo.UserAgent.String)
		if err != nil {
			response.NewError(m.logger, w, r, err)
			return
		}

		allowedUserTypes := map[valueobject.UserType]bool{
			valueobject.UserTypeAdmin:     true,
			valueobject.UserTypeModerator: true,
			valueobject.UserTypeClient:    false,
		}

		if !allowedUserTypes[u.GetUserType()] {
			response.NewError(m.logger, w, r, ErrDoNotHaveAnAccess)
			return
		}

		ctx := context.WithValue(r.Context(), "sessionKey", session.Value)
		ctx = context.WithValue(ctx, "user", *u)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (m *Middleware) NoAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		session, err := r.Cookie("session")
		if err == nil {
			next.ServeHTTP(w, r)
			return
		}

		if session != nil {
			if err = m.service.Logout(r.Context(), session.Value); err != nil {
				response.NewError(m.logger, w, r, err)
				return
			}
		}

		next.ServeHTTP(w, r)
	})
}
