package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/manjurulhoque/foodie/backend/internal/db"
	"github.com/manjurulhoque/foodie/backend/internal/models"
	"github.com/manjurulhoque/foodie/backend/pkg/utils"
)

type AdminOverview struct {
	TotalUsers        int64   `json:"total_users"`
	TotalOrders       int64   `json:"total_orders"`
	TotalRevenue      float64 `json:"total_revenue"`
	ActiveRestaurants int64   `json:"active_restaurants"`
}

type DailyOrderStats struct {
	Date  string `json:"date"`
	Count int64  `json:"count"`
}

type PopularItem struct {
	Name       string `json:"name"`
	OrderCount int64  `json:"order_count"`
}

type MonthlyRevenue struct {
	Month   string  `json:"month"`
	Revenue float64 `json:"revenue"`
}

type AdminAnalytics struct {
	DailyOrders    []DailyOrderStats `json:"daily_orders"`
	PopularItems   []PopularItem     `json:"popular_items"`
	RevenueByMonth []MonthlyRevenue  `json:"revenue_by_month"`
}

type UserActivity struct {
	Name       string  `json:"name"`
	OrderCount int64   `json:"order_count"`
	TotalSpent float64 `json:"total_spent"`
}

type RestaurantStat struct {
	Name         string  `json:"name"`
	OrderCount   int64   `json:"order_count"`
	AvgRating    float64 `json:"avg_rating"`
	TotalRevenue float64 `json:"total_revenue"`
}

type AdminReport struct {
	RecentOrders    []models.Order   `json:"recent_orders"`
	UserActivity    []UserActivity   `json:"user_activity"`
	RestaurantStats []RestaurantStat `json:"restaurant_stats"`
}

func GetAdminOverview(c *gin.Context) {
	var overview AdminOverview

	// Get total users
	db.DB.Model(&models.User{}).Count(&overview.TotalUsers)

	// Get total orders
	db.DB.Model(&models.Order{}).Count(&overview.TotalOrders)

	// Get total revenue
	db.DB.Model(&models.Order{}).Select("COALESCE(SUM(total_amount), 0)").Scan(&overview.TotalRevenue)

	// Get active restaurants
	db.DB.Model(&models.Restaurant{}).Where("is_active = ?", true).Count(&overview.ActiveRestaurants)

	c.JSON(http.StatusOK, utils.GenericResponse[AdminOverview]{
		Success: true,
		Message: "Admin overview fetched successfully",
		Data:    overview,
	})
}

func GetAdminAnalytics(c *gin.Context) {
	var analytics AdminAnalytics

	// Initialize empty slices
	analytics.DailyOrders = []DailyOrderStats{}
	analytics.PopularItems = []PopularItem{}
	analytics.RevenueByMonth = []MonthlyRevenue{}

	// Get daily order stats
	db.DB.Raw(`
		SELECT date(created_at) as date, COUNT(*) as count
		FROM orders
		WHERE created_at >= datetime('now', '-30 days')
		GROUP BY date(created_at)
		ORDER BY date DESC
	`).Scan(&analytics.DailyOrders)

	// Get popular items
	db.DB.Raw(`
		SELECT menu_items.name, COUNT(order_items.id) as order_count
		FROM order_items
		JOIN menu_items ON order_items.menu_item_id = menu_items.id
		GROUP BY menu_items.id, menu_items.name
		ORDER BY order_count DESC
		LIMIT 10
	`).Scan(&analytics.PopularItems)

	// Get monthly revenue
	db.DB.Raw(`
		SELECT strftime('%Y-%m', created_at) as month, COALESCE(SUM(total_amount), 0) as revenue
		FROM orders
		WHERE created_at >= datetime('now', '-12 months')
		GROUP BY strftime('%Y-%m', created_at)
		ORDER BY month DESC
	`).Scan(&analytics.RevenueByMonth)

	c.JSON(http.StatusOK, utils.GenericResponse[AdminAnalytics]{
		Success: true,
		Message: "Admin analytics fetched successfully",
		Data:    analytics,
	})
}

func GetAdminReports(c *gin.Context) {
	var report AdminReport

	// Initialize empty slices
	report.RecentOrders = []models.Order{}
	report.UserActivity = []UserActivity{}
	report.RestaurantStats = []RestaurantStat{}

	// Get recent orders
	db.DB.Preload("User").Preload("Restaurant").
		Order("created_at DESC").
		Limit(10).
		Find(&report.RecentOrders)

	// Get user activity
	db.DB.Raw(`
		SELECT users.name, COUNT(orders.id) as order_count, COALESCE(SUM(orders.total_amount), 0) as total_spent
		FROM users
		LEFT JOIN orders ON users.id = orders.user_id
		GROUP BY users.id, users.name
		ORDER BY order_count DESC
		LIMIT 10
	`).Scan(&report.UserActivity)

	// Get restaurant stats
	db.DB.Raw(`
		SELECT restaurants.name, COUNT(orders.id) as order_count, 
			   COALESCE(AVG(orders.total_amount), 0) as avg_rating, 
			   COALESCE(SUM(orders.total_amount), 0) as total_revenue
		FROM restaurants
		LEFT JOIN orders ON restaurants.id = orders.restaurant_id
		GROUP BY restaurants.id, restaurants.name
		ORDER BY order_count DESC
	`).Scan(&report.RestaurantStats)

	c.JSON(http.StatusOK, utils.GenericResponse[AdminReport]{
		Success: true,
		Message: "Admin report fetched successfully",
		Data:    report,
	})
}
