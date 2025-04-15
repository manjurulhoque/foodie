package handlers

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"

	"github.com/stretchr/testify/mock"

	"github.com/manjurulhoque/foodie/backend/internal/models"
	"github.com/manjurulhoque/foodie/backend/pkg/utils"

	"mime/multipart"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
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

// MockDB is a mock of gorm.DB
type MockDB struct {
	mock.Mock
	*gorm.DB
}

func (m *MockDB) Begin() *gorm.DB {
	m.Called()
	return m.DB
}

func (m *MockDB) Create(value interface{}) *gorm.DB {
	m.Called(value)
	return m.DB
}

func (m *MockDB) Where(query interface{}, args ...interface{}) *gorm.DB {
	m.Called(query, args)
	return m.DB
}

func (m *MockDB) Find(dest interface{}, conds ...interface{}) *gorm.DB {
	m.Called(dest, conds)
	return m.DB
}

func (m *MockDB) Model(value interface{}) *gorm.DB {
	m.Called(value)
	return m.DB
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

func TestGetRestaurant(t *testing.T) {
	mockService := new(MockRestaurantService)
	mockDB := &gorm.DB{}
	handler := NewRestaurantHandler(mockService, mockDB)
	router := setupTestRouter(handler)

	tests := []struct {
		name          string
		restaurantID  uint
		mockSetup     func()
		expectedCode  int
		expectedFound bool
	}{
		{
			name:         "Success - Found",
			restaurantID: 1,
			mockSetup: func() {
				mockService.On("GetRestaurant", uint(1)).
					Return(&models.Restaurant{BaseModel: models.BaseModel{ID: 1}, Name: "Test Restaurant"}, nil)
			},
			expectedCode:  http.StatusOK,
			expectedFound: true,
		},
		{
			name:         "Success - Not Found",
			restaurantID: 2,
			mockSetup: func() {
				mockService.On("GetRestaurant", uint(2)).
					Return(nil, errors.New("restaurant not found"))
			},
			expectedCode:  http.StatusNotFound,
			expectedFound: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tt.mockSetup()

			w := httptest.NewRecorder()
			req, _ := http.NewRequest("GET", "/api/restaurants/"+strconv.Itoa(int(tt.restaurantID)), nil)
			router.ServeHTTP(w, req)

			assert.Equal(t, tt.expectedCode, w.Code)

			if tt.expectedFound {
				var response map[string]interface{}
				err := json.Unmarshal(w.Body.Bytes(), &response)
				assert.NoError(t, err)
				assert.True(t, response["success"].(bool))

				restaurant := response["data"].(map[string]interface{})
				assert.Equal(t, tt.restaurantID, uint(restaurant["id"].(float64)))
				assert.Equal(t, "Test Restaurant", restaurant["name"].(string))
			} else {
				assert.Equal(t, http.StatusNotFound, w.Code)
			}
		})
	}
}

func TestCreateRestaurant(t *testing.T) {
	mockService := new(MockRestaurantService)
	db, _ := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})

	// Auto-migrate the database
	db.AutoMigrate(&models.Restaurant{}, &models.Cuisine{})

	mockDB := &MockDB{DB: db}
	handler := NewRestaurantHandler(mockService, mockDB.DB)

	// Create a mock context with user ID
	gin.SetMode(gin.TestMode)

	// Mock the transaction
	mockDB.On("Begin").Return(db)
	mockDB.On("Create", mock.Anything).Return(db)
	mockDB.On("Where", mock.Anything, mock.Anything).Return(db)
	mockDB.On("Find", mock.Anything, mock.Anything).Return(db)
	mockDB.On("Model", mock.Anything).Return(db)

	tests := []struct {
		name            string
		formData        map[string]string
		mockSetup       func()
		expectedCode    int
		expectedSuccess bool
	}{
		{
			name: "Success - Valid Restaurant",
			formData: map[string]string{
				"name":        "Test Restaurant",
				"description": "Test Description",
				"address":     "Test Address",
				"phone":       "1234567890",
				"email":       "test@example.com",
			},
			mockSetup: func() {
				mockService.On("CreateRestaurant", mock.Anything).
					Return(nil)
			},
			expectedCode:    http.StatusCreated,
			expectedSuccess: true,
		},
		{
			name: "Failure - Missing Required Fields",
			formData: map[string]string{
				"name":        "",
				"description": "Test Description",
				"address":     "Test Address",
				"phone":       "1234567890",
				"email":       "test@example.com",
			},
			mockSetup: func() {
				// No mock setup needed as validation should fail before service is called
			},
			expectedCode:    http.StatusBadRequest,
			expectedSuccess: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Create a new recorder for each test case
			w := httptest.NewRecorder()
			c, _ := gin.CreateTestContext(w)
			c.Set("userId", uint(1))

			tt.mockSetup()

			// Create a multipart form
			body := &bytes.Buffer{}
			writer := multipart.NewWriter(body)

			// Add form fields
			for key, value := range tt.formData {
				_ = writer.WriteField(key, value)
			}

			// Only add image for success case
			if tt.name == "Success - Valid Restaurant" {
				part, _ := writer.CreateFormFile("image", "image.png")
				part.Write([]byte("dummy image content"))
			}

			// Close the writer
			writer.Close()

			// Create the request
			req, httpRequestError := http.NewRequest("POST", "/api/restaurants", body)
			if httpRequestError != nil {
				t.Fatalf("Failed to create request: %v", httpRequestError)
			}
			req.Header.Set("Content-Type", writer.FormDataContentType())

			// Set up the context with the request
			c.Request = req

			// Call the handler directly
			handler.CreateRestaurant(c)

			assert.Equal(t, tt.expectedCode, w.Code)

			// For failure case, we need to check the response differently
			if tt.expectedCode == http.StatusBadRequest {
				var errorResponse utils.GenericResponse[any]
				err := json.Unmarshal(w.Body.Bytes(), &errorResponse)
				// fmt.Printf("Response body for %s: %s\n", tt.name, string(w.Body.String()))
				assert.NoError(t, err)
				assert.False(t, errorResponse.Success)
				assert.Contains(t, errorResponse.Message, "Invalid form data")
				return
			}

			// For success case, unmarshal as Restaurant
			var response utils.GenericResponse[models.Restaurant]
			err := json.Unmarshal(w.Body.Bytes(), &response)
			assert.NoError(t, err)
			assert.Equal(t, tt.expectedSuccess, response.Success)
		})
	}
}
