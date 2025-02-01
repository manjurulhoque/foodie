package utils

import (
	"github.com/gin-gonic/gin"
)

// GetUserID extracts the user ID from the gin context
// This is set by the auth middleware after validating the token
func GetUserID(c *gin.Context) uint {
	userID, exists := c.Get("user_id")
	if !exists {
		return 0
	}
	return userID.(uint)
}
