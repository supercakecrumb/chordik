package http

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestCSRFCrossOriginRejected(t *testing.T) {
	gin.SetMode(gin.TestMode)
	t.Setenv("FRONTEND_ORIGIN", "https://frontend.example.invalid")
	for _, tc := range []struct {
		origin string
		header bool
		want   int
	}{
		{"https://attacker.example.invalid", true, 403}, {"https://api.example.invalid", true, 204},
		{"https://frontend.example.invalid", true, 204}, {"null", true, 403}, {"", false, 403},
	} {
		r := gin.New()
		r.Use(csrfMiddleware())
		r.POST("/", func(c *gin.Context) { c.Status(204) })
		req := httptest.NewRequest("POST", "https://api.example.invalid/", nil)
		req.Header.Set("Origin", tc.origin)
		if tc.header {
			req.Header.Set("X-Requested-With", "XMLHttpRequest")
		}
		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)
		if w.Code != tc.want {
			t.Errorf("origin %q status=%d want=%d", tc.origin, w.Code, tc.want)
		}
	}
}
func TestHTTPSCookieProtection(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.GET("/", func(c *gin.Context) { setSessionCookie(c, uuid.New()); c.Status(204) })
	req := httptest.NewRequest("GET", "https://api.example.invalid/", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	cs := w.Result().Cookies()
	if len(cs) != 1 || !cs[0].Secure || !cs[0].HttpOnly || cs[0].SameSite != http.SameSiteLaxMode {
		t.Fatal("session cookie protections missing")
	}
}
