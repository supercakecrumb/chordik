package http

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/supercakecrumb/chordik/internal/auth"
)

type AuthHandlers struct {
	authService *auth.AuthService
}

func NewAuthHandlers(authService *auth.AuthService) *AuthHandlers {
	return &AuthHandlers{authService: authService}
}

type registerRequest struct {
	Email       string `json:"email" binding:"required,email"`
	Password    string `json:"password" binding:"required,min=8"`
	DisplayName string `json:"displayName" binding:"required,min=3"`
}

func (h *AuthHandlers) Register(c *gin.Context) {
	var req registerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.authService.Register(req.Email, req.Password, req.DisplayName)
	if err != nil {
		if err == auth.ErrEmailTaken {
			c.JSON(http.StatusConflict, gin.H{"error": "Email already in use"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Registration failed"})
		return
	}

	session, err := h.authService.CreateSession(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create session"})
		return
	}

	setSessionCookie(c, session.ID)
	c.JSON(http.StatusCreated, gin.H{"id": user.ID})
}

type loginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

func (h *AuthHandlers) Login(c *gin.Context) {
	var req loginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.authService.Login(req.Email, req.Password)
	if err != nil {
		if err == auth.ErrInvalidCredentials {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Login failed"})
		return
	}

	session, err := h.authService.CreateSession(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create session"})
		return
	}

	setSessionCookie(c, session.ID)
	c.JSON(http.StatusOK, gin.H{"id": user.ID})
}

func (h *AuthHandlers) Logout(c *gin.Context) {
	sessionID, err := getSessionID(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No active session"})
		return
	}

	if err := h.authService.DeleteSession(sessionID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to invalidate session"})
		return
	}

	c.SetCookie("session", "", -1, "/", "", false, true)
	c.Status(http.StatusNoContent)
}

func (h *AuthHandlers) GetCurrentUser(c *gin.Context) {
	sessionID, err := getSessionID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Not authenticated"})
		return
	}

	user, err := h.authService.GetUserFromSession(sessionID)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid session"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":          user.ID,
		"email":       user.Email,
		"displayName": user.DisplayName,
	})
}

func setSessionCookie(c *gin.Context, sessionID uuid.UUID) {
	c.SetCookie("session", sessionID.String(), int((time.Hour * 24 * 7).Seconds()), "/", "", false, true)
}

func getSessionID(c *gin.Context) (uuid.UUID, error) {
	cookie, err := c.Cookie("session")
	if err != nil {
		return uuid.Nil, err
	}
	return uuid.Parse(cookie)
}
