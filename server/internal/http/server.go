package http

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/supercakecrumb/chordik/internal/auth"
	"github.com/supercakecrumb/chordik/internal/songs"
	"github.com/supercakecrumb/chordik/internal/votes"
	"gorm.io/gorm"
)

type Server struct {
	db          *gorm.DB
	router      *gin.Engine
	auth        *auth.AuthService
	songService *songs.SongService
	voteService *votes.VoteService
}

func NewServer(db *gorm.DB) *Server {
	s := &Server{
		db:          db,
		router:      gin.Default(),
		auth:        auth.NewAuthService(db),
		songService: songs.NewSongService(db),
		voteService: votes.NewVoteService(db),
	}

	// Add CORS middleware
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:5173"}
	config.AllowCredentials = true
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	s.router.Use(cors.New(config))

	// Add CSRF protection middleware for mutating requests
	s.router.Use(csrfMiddleware())

	s.setupRoutes()

	return s
}

func (s *Server) setupRoutes() {
	authHandlers := NewAuthHandlers(s.auth)
	songHandlers := NewSongHandlers(s.songService)
	voteHandlers := NewVoteHandlers(s.voteService)

	// Public routes
	s.router.GET("/api/health", s.handleHealthCheck)

	// Auth routes
	authGroup := s.router.Group("/api/auth")
	{
		authGroup.POST("/register", authHandlers.Register)
		authGroup.POST("/login", authHandlers.Login)
		authGroup.POST("/logout", authHandlers.Logout)
		authGroup.GET("/me", authHandlers.GetCurrentUser)
	}

	// Protected API routes
	api := s.router.Group("/api")
	api.Use(s.authMiddleware())
	{
		// Song routes
		api.POST("/songs", songHandlers.CreateSong)
		api.GET("/songs/:id", songHandlers.GetSong)
		api.PUT("/songs/:id", songHandlers.UpdateSong)
		api.DELETE("/songs/:id", songHandlers.DeleteSong)
		api.GET("/songs", songHandlers.ListSongs)

		// Vote routes
		api.POST("/songs/:id/vote", voteHandlers.Vote)
		api.GET("/songs/:id/vote", voteHandlers.GetVote)
	}
}

func (s *Server) handleHealthCheck(c *gin.Context) {
	// Check database connection
	if err := s.db.Exec("SELECT 1").Error; err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"status": "db_unavailable",
			"error":  err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "ok",
		"services": gin.H{
			"database": "connected",
		},
	})
}

func (s *Server) authMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		sessionID, err := getSessionID(c)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Not authenticated"})
			return
		}

		user, err := s.auth.GetUserFromSession(sessionID)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid session"})
			return
		}

		c.Set("userID", user.ID)
		c.Next()
	}
}

func csrfMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Allow GET, HEAD, and OPTIONS requests (OPTIONS is for CORS preflight)
		if c.Request.Method == http.MethodGet || c.Request.Method == http.MethodHead || c.Request.Method == http.MethodOptions {
			c.Next()
			return
		}

		// TODO: Implement proper CSRF token validation
		// For now just check for custom header
		if c.GetHeader("X-Requested-With") != "XMLHttpRequest" {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "CSRF protection"})
			return
		}

		c.Next()
	}
}

func (s *Server) Run(addr string) error {
	return s.router.Run(addr)
}
