package services

import (
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"github.com/manjurulhoque/foodie/backend/internal/models"
	"github.com/manjurulhoque/foodie/backend/internal/repositories"
	"time"
	"errors"
	"fmt"
)

// Define constants for token expiration
const (
	accessTokenExpiry  = time.Hour * 24 * 7
	refreshTokenExpiry = time.Hour * 24 * 30
)

type UserService interface {
	RegisterUser(name, email, password, phone string) error
	LoginUser(email, password string) (string, string, error)
}

var jwtSecret = []byte("ABC1234567890")

type JWTCustomClaims struct {
	jwt.RegisteredClaims
	Role   string `json:"role"`
	Name   string `json:"name"`
	Email  string `json:"email"`
	UserId uint   `json:"user_id"`
}

type userService struct {
	userRepo repositories.UserRepository
}

func NewUserService(repo repositories.UserRepository) UserService {
	return &userService{userRepo: repo}
}

// Password Hashing and Verification
func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func checkPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// RegisterUser Register User
func (s *userService) RegisterUser(name, email, password, phone string) error {
	hashedPassword, err := hashPassword(password)
	if err != nil {
		return err
	}

	user := &models.User{
		Name:    name,
		Email:   email,
		Password: hashedPassword,
		Phone:   phone,
		Role:    models.RoleCustomer,
	}

	return s.userRepo.CreateUser(user)
}

// LoginUser Login User
func (s *userService) LoginUser(email, password string) (string, string, error) {
	user, err := s.userRepo.GetUserByEmail(email)
	if err != nil {
		return "", "", errors.New("invalid email or password")
	}

	if !checkPasswordHash(password, user.Password) {
		return "", "", errors.New("invalid email or password")
	}

	// Generate Access and Refresh Tokens
	accessToken, err := s.generateToken(user, accessTokenExpiry)
	if err != nil {
		return "", "", err
	}

	refreshToken, err := s.generateToken(user, refreshTokenExpiry)
	if err != nil {
		return "", "", err
	}

	user.LastLoginAt = time.Now()
	s.userRepo.UpdateUser(user.ID, map[string]interface{}{"last_login_at": user.LastLoginAt})

	return accessToken, refreshToken, nil
}

// generateToken Generate JWT Token
func (s *userService) generateToken(user *models.User, expiry time.Duration) (string, error) {
	claims := JWTCustomClaims{
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   fmt.Sprintf("%d", user.ID),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(expiry)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ID:        uuid.New().String(),
		},
		Role:   user.Role,
		Name:   user.Name,
		Email:  user.Email,
		UserId: user.ID,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}
