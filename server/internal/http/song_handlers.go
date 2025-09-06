package http

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/supercakecrumb/chordik/internal/db"
	"github.com/supercakecrumb/chordik/internal/songs"
)

type SongHandlers struct {
	songService *songs.SongService
}

func NewSongHandlers(songService *songs.SongService) *SongHandlers {
	return &SongHandlers{songService: songService}
}

type ListSongsResponse struct {
	Songs []db.Song `json:"songs"`
	Total int64     `json:"total"`
}

func (h *SongHandlers) ListSongs(c *gin.Context) {
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	search := c.Query("search")

	songs, total, err := h.songService.ListSongs(offset, limit, search)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to list songs"})
		return
	}

	c.JSON(http.StatusOK, ListSongsResponse{
		Songs: songs,
		Total: total,
	})
}

func (h *SongHandlers) GetSong(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid song ID"})
		return
	}

	song, err := h.songService.GetSong(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Song not found"})
		return
	}
	c.JSON(http.StatusOK, song)
}

func (h *SongHandlers) CreateSong(c *gin.Context) {
	var req struct {
		Title        string `json:"title" binding:"required"`
		Artist       string `json:"artist" binding:"required"`
		BodyChordPro string `json:"bodyChordPro" binding:"required"`
		Key          string `json:"key"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, _ := c.Get("userID") // From auth middleware
	created, err := h.songService.CreateSong(
		userID.(uuid.UUID),
		req.Title,
		req.Artist,
		req.BodyChordPro,
		req.Key,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, created)
}

func (h *SongHandlers) UpdateSong(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid song ID"})
		return
	}

	var req struct {
		Title        string `json:"title" binding:"required"`
		Artist       string `json:"artist" binding:"required"`
		BodyChordPro string `json:"bodyChordPro" binding:"required"`
		Key          string `json:"key"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, _ := c.Get("userID") // From auth middleware
	updated, err := h.songService.UpdateSong(
		userID.(uuid.UUID),
		id,
		req.Title,
		req.Artist,
		req.BodyChordPro,
		req.Key,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, updated)
}

func (h *SongHandlers) DeleteSong(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid song ID"})
		return
	}

	userID, _ := c.Get("userID") // From auth middleware
	if err := h.songService.DeleteSong(userID.(uuid.UUID), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}
