package handlers

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/mock"

	"github.com/manjurulhoque/foodie/backend/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

// MockRestaurantService is a mock of RestaurantService
type MockRestaurantService struct {
	mock.Mock
}

func (m *MockRestaurantService) CreateRestaurant(restaurant map[string]interface{}) error {
	args := m.Called(restaurant)
	return args.Error(0)
}

func (m *MockRestaurantService) GetRestaurant(id uint) (*models.Restaurant, error) {
	args := m.Called(id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*models.Restaurant), args.Error(1)
}

func (m *MockRestaurantService) UpdateRestaurant(restaurant interface{}, id uint) error {
	args := m.Called(restaurant, id)
	return args.Error(0)
}

func (m *MockRestaurantService) DeleteRestaurant(id uint) error {
	args := m.Called(id)
	return args.Error(0)
}

func (m *MockRestaurantService) GetRestaurantsByUser(userID uint) ([]models.Restaurant, error) {
	args := m.Called(userID)
	return args.Get(0).([]models.Restaurant), args.Error(1)
}

func (m *MockRestaurantService) GetAllRestaurants(page, limit int, cuisineID uint, minRating float32) ([]models.Restaurant, int64, error) {
	args := m.Called(page, limit, cuisineID, minRating)
	return args.Get(0).([]models.Restaurant), args.Get(1).(int64), args.Error(2)
}

func (m *MockRestaurantService) GetRestaurantsByCuisine(cuisineID uint) ([]models.Restaurant, error) {
	args := m.Called(cuisineID)
	return args.Get(0).([]models.Restaurant), args.Error(1)
}

func (m *MockRestaurantService) UpdateWorkingHours(restaurantID uint, workingHours []models.WorkingHour) error {
	args := m.Called(restaurantID, workingHours)
	return args.Error(0)
}

func (m *MockRestaurantService) GetWorkingHours(restaurantID uint) ([]models.WorkingHour, error) {
	args := m.Called(restaurantID)
	return args.Get(0).([]models.WorkingHour), args.Error(1)
}

func (m *MockRestaurantService) GetAllRestaurantsByOwnerID(userID uint) ([]models.Restaurant, error) {
	args := m.Called(userID)
	return args.Get(0).([]models.Restaurant), args.Error(1)
}

// setupTestRouter creates a test router with the given handler
func setupTestRouter(h *RestaurantHandler) *gin.Engine {
	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.GET("/api/restaurants", h.GetAllRestaurants)
	router.GET("/api/restaurants/:id", h.GetRestaurant)
	router.POST("/api/restaurants", h.CreateRestaurant)
	router.PUT("/api/restaurants/:id", h.UpdateRestaurant)
	router.DELETE("/api/restaurants/:id", h.DeleteRestaurant)
	return router
}

func TestGetAllRestaurants(t *testing.T) {
	mockService := new(MockRestaurantService)
	mockDB := &gorm.DB{}
	handler := NewRestaurantHandler(mockService, mockDB)
	router := setupTestRouter(handler)

	tests := []struct {
		name          string
		query         string
		mockSetup     func()
		expectedCode  int
		expectedItems int
	}{
		{
			name:  "Success - Default Pagination",
			query: "",
			mockSetup: func() {
				restaurants := []models.Restaurant{{Name: "Test Restaurant"}}
				mockService.On("GetAllRestaurants", 1, 10, uint(0), float32(0)).
					Return(restaurants, int64(1), nil)
			},
			expectedCode:  http.StatusOK,
			expectedItems: 1,
		},
		{
			name:  "Success - With Pagination",
			query: "?page=2&limit=5",
			mockSetup: func() {
				restaurants := []models.Restaurant{{Name: "Test Restaurant 2"}}
				mockService.On("GetAllRestaurants", 2, 5, uint(0), float32(0)).
					Return(restaurants, int64(1), nil)
			},
			expectedCode:  http.StatusOK,
			expectedItems: 1,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tt.mockSetup()

			w := httptest.NewRecorder()
			req, _ := http.NewRequest("GET", "/api/restaurants"+tt.query, nil)
			router.ServeHTTP(w, req)

			assert.Equal(t, tt.expectedCode, w.Code)

			var response map[string]interface{}
			err := json.Unmarshal(w.Body.Bytes(), &response)
			assert.NoError(t, err)
			assert.True(t, response["success"].(bool))

			data := response["data"].(map[string]interface{})
			restaurants := data["data"].([]interface{})
			assert.Equal(t, tt.expectedItems, len(restaurants))
		})
	}
}
