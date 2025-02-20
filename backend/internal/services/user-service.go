package services

import (
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/manjurulhoque/foodie/backend/internal/models"
	"github.com/manjurulhoque/foodie/backend/internal/repositories"
	"golang.org/x/crypto/bcrypt"
)

// Define constants for token expiration
const (
	accessTokenExpiry  = time.Hour * 24 * 7  // 7 days
	refreshTokenExpiry = time.Hour * 24 * 30 // 30 days
)

type UserService interface {
	RegisterUser(name, email, password, phone string) error
	LoginUser(email, password string) (string, string, error)
	GetUserById(id uint) (*models.PublicUser, error)
	GetUserByEmail(email string) (*models.PublicUser, error)
	VerifyToken(token string) (*JWTCustomClaims, error)
	GetAllUsers() ([]models.PublicUser, error)
}

var jwtSecret = []byte("ABC1234567890")

type JWTCustomClaims struct {
	jwt.RegisteredClaims
	Role  string `json:"role"`
	Name  string `json:"name"`
	Email string `json:"email"`
	Id    uint   `json:"id"`
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
		Name:     name,
		Email:    email,
		Password: hashedPassword,
		Phone:    phone,
		Role:     models.RoleCustomer,
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
		Role:  user.Role,
		Name:  user.Name,
		Email: user.Email,
		Id:    user.ID,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

func (s *userService) GetUserById(id uint) (*models.PublicUser, error) {
	user, err := s.userRepo.GetUserById(id)
	if err != nil {
		return nil, err
	}

	return &models.PublicUser{
		Id:    user.ID,
		Name:  user.Name,
		Image: user.Image,
		Email: user.Email,
		Phone: user.Phone,
		Role:  user.Role,
	}, nil
}

func (s *userService) GetUserByEmail(email string) (*models.PublicUser, error) {
	user, err := s.userRepo.GetUserByEmail(email)
	if err != nil {
		return nil, err
	}

	return &models.PublicUser{
		Id:    user.ID,
		Name:  user.Name,
		Image: user.Image,
		Email: user.Email,
		Phone: user.Phone,
		Role:  user.Role,
	}, nil
}

// VerifyToken Verify token
func (s *userService) VerifyToken(tokenString string) (*JWTCustomClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &JWTCustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if err != nil {
		return nil, err
	}
	claims, ok := token.Claims.(*JWTCustomClaims)
	if !ok || !token.Valid {
		return nil, errors.New("unauthorized")
	}
	return claims, nil
}

func (s *userService) GetAllUsers() ([]models.PublicUser, error) {
	return s.userRepo.FindAllUsers()
}
