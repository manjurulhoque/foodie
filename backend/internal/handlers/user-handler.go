package handlers

import (
	"github.com/gin-gonic/gin"
	"github.com/manjurulhoque/foodie/backend/internal/models"
	"github.com/manjurulhoque/foodie/backend/internal/services"
	"github.com/manjurulhoque/foodie/backend/pkg/utils"
	"log/slog"
	"net/http"
)

type UserHandler struct {
	userService services.UserService
}

func NewUserHandler(userService services.UserService) *UserHandler {
	return &UserHandler{userService: userService}
}

// Register user handler
// @Summary Register a new user
// @Description Register a new user
// @Tags user
// @Accept json
// @Produce json
// @Param user body models.User true "User object"
// @Success 200 {object} models.User
// @Router /register [post]
func (h *UserHandler) Register(c *gin.Context) {
	var input struct {
		Name      string `json:"name" validate:"required,min=3,max=32"`
		Email     string `json:"email" validate:"required,email,emailExists"`
		Password1 string `json:"password1" validate:"required,min=6,max=32"`
		Password2 string `json:"password2" validate:"required,min=6,max=32"`
		Phone     string `json:"phone" validate:"required,min=4,max=15"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success:    false,
			Message:    "Invalid request",
			Errors:     []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	slog.Info("Input", "input", input)

	errs := utils.TranslateError(input)
	if len(errs) > 0 {
		newErrs := make([]utils.ErrorDetail, len(errs))
		for i, err := range errs {
			newErrs[i] = utils.ErrorDetail{
				Message: err.Message,
				Code:    err.Field,
			}
		}
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success:    false,
			Message:    "Invalid request",
			Errors:     newErrs,
		})
		return
	}

	if input.Password1 != input.Password2 {
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success:    false,
			Message:    "Passwords do not match",
			Errors:     []utils.ErrorDetail{{Message: "Passwords do not match"}},
		})
		return
	}

	if err := h.userService.RegisterUser(input.Name, input.Email, input.Password1, input.Phone); err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success:    false,
			Message:    "Failed to register user",
			Errors:     []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	c.JSON(http.StatusCreated, utils.GenericResponse[any]{
		Success:    true,
		Message:    "User registered successfully",
	})
}

// Login user handler
// @Summary Login a user
// @Description Login a user
// @Tags user
// @Accept json
// @Produce json
// @Param user body models.User true "User object"
// @Success 200 {object} models.User
// @Router /login [post]
func (h *UserHandler) Login(c *gin.Context) {
	var input struct {
		Email    string `json:"email" validate:"required"`
		Password string `json:"password" validate:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success:    false,
			Message:    "Invalid request",
			Errors:     []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	accessToken, refreshToken, err := h.userService.LoginUser(input.Email, input.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, utils.GenericResponse[any]{
			Success:    false,
			Message:    "Invalid credentials",
			Errors:     []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	c.JSON(http.StatusOK, utils.GenericResponse[any]{
		Success:    true,
		Message:    "Login successful",
		Data: gin.H{
			"access":  accessToken,
			"refresh": refreshToken,
		},
	})
}

func (h *UserHandler) Me(c *gin.Context) {
	userEmail := c.GetString("email")
	user, err := h.userService.GetUserByEmail(userEmail)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success:    false,
			Message:    "Failed to get user",
			Errors:     []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	c.JSON(http.StatusOK, utils.GenericResponse[models.PublicUser]{
		Success:    true,
		Message:    "User fetched successfully",
		Data:       *user,
	})
}
