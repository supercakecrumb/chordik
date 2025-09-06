package http

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/supercakecrumb/chordik/internal/votes"
)

type VoteHandlers struct {
	voteService *votes.VoteService
}

func NewVoteHandlers(voteService *votes.VoteService) *VoteHandlers {
	return &VoteHandlers{voteService: voteService}
}

type voteRequest struct {
	Value votes.VoteValue `json:"value" binding:"required,oneof=1 -1 0"` // 1=like, -1=dislike, 0=remove
}

func (h *VoteHandlers) Vote(c *gin.Context) {
	userID := c.MustGet("userID").(uuid.UUID)
	songID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid song ID"})
		return
	}

	var req voteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	score, err := h.voteService.Vote(userID, songID, req.Value)
	if err != nil {
		if err == votes.ErrSongNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Song not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process vote"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"score":    score,
		"userVote": req.Value,
	})
}

func (h *VoteHandlers) GetVote(c *gin.Context) {
	userID := c.MustGet("userID").(uuid.UUID)
	songID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid song ID"})
		return
	}

	vote, err := h.voteService.GetUserVote(userID, songID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get vote"})
		return
	}

	score, err := h.voteService.GetSongScore(songID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get song score"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"score":    score,
		"userVote": vote,
	})
}
