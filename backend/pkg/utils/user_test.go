package utils

import (
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestGetUserID(t *testing.T) {
	c := gin.Context{}
	c.Set("userId", uint(1))
	assert.Equal(t, GetUserID(&c), uint(1))
}
