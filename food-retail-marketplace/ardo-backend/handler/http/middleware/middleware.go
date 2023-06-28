package middleware

import (
	"context"
	"github/nnniyaz/ardo/domain/user/valueobject"
	"github/nnniyaz/ardo/handler/http/response"
	"github/nnniyaz/ardo/pkg/core"
	"github/nnniyaz/ardo/pkg/logger"
	"github/nnniyaz/ardo/pkg/web"
	"github/nnniyaz/ardo/service/auth"
	"net/http"
	"strconv"
)

var (
	ErrDoNotHaveAnAccess = core.NewI18NError(core.EFORBIDDEN, core.TXT_DO_NOT_HAVE_AN_ACCESS)
)

type Middleware struct {
	service auth.AuthService
	logger  logger.Logger
}

func New(s auth.AuthService, l logger.Logger) *Middleware {
	return &Middleware{service: s, logger: l}
}

func (m *Middleware) RequestInfo(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "requestInfo", web.GetRequestInfo(r))
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (m *Middleware) Trace(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "traceId", web.GenerateTraceId())
		next.ServeHTTP(w, r.WithContext(ctx))
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
			limit = 10
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

func (m *Middleware) UserIdParam(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		id := getParam(r, "user_id")
		ctx := context.WithValue(r.Context(), "user_id", id)
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

		if u.GetUserType() != valueobject.UserTypeStaff {
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

func getParam(r *http.Request, name string) string {
	return r.URL.Query().Get(name)
}

func getParamInt64(r *http.Request, name string) (int64, error) {
	return strconv.ParseInt(getParam(r, name), 10, 64)
}

func getParamBool(r *http.Request, name string) (bool, error) {
	return strconv.ParseBool(getParam(r, name))
}
