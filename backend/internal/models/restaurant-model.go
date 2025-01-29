package models


type Restaurant struct {
	BaseModel
	Name        string     `json:"name" validate:"required"`
	Description string     `json:"description"`
	Address     string     `json:"address" validate:"required"`
	Phone       string     `json:"phone" validate:"required"`
	Email       string     `json:"email" validate:"required,email"`
	Cuisine     string     `json:"cuisine"`
	Rating      float32    `json:"rating" gorm:"default:0"`
	Image       string     `json:"image"`
	IsActive    bool       `json:"is_active" gorm:"default:true"`
	UserID      uint       `json:"user_id"`
	
	User        User       `json:"user" gorm:"foreignKey:UserID"`
	MenuItems   []MenuItem `json:"menu_items" gorm:"foreignKey:RestaurantID"`
}

type MenuItem struct {
	BaseModel
	Name         string     `json:"name" validate:"required"`
	Description  string     `json:"description"`
	Price        float64    `json:"price" validate:"required"`
	Image        string     `json:"image"`
	Category     string     `json:"category" validate:"required"`
	IsAvailable  bool       `json:"is_available" gorm:"default:true"`
	RestaurantID uint       `json:"restaurant_id"`
	Restaurant   Restaurant `json:"-" gorm:"foreignKey:RestaurantID"`
}

type Order struct {
	BaseModel
	UserID          uint        `json:"user_id"`
	User            User        `json:"-" gorm:"foreignKey:UserID"`
	RestaurantID    uint        `json:"restaurant_id"`
	Restaurant      Restaurant  `json:"-" gorm:"foreignKey:RestaurantID"`
	Items           []OrderItem `json:"items" gorm:"foreignKey:OrderID"`
	TotalAmount     float64     `json:"total_amount"`
	Status          string      `json:"status" gorm:"default:'pending'"`
	DeliveryAddress string      `json:"delivery_address" binding:"required"`
	PaymentStatus   string      `json:"payment_status" gorm:"default:'pending'"`
	PaymentMethod   string      `json:"payment_method" binding:"required"`
}

type OrderItem struct {
	BaseModel
	OrderID    uint     `json:"order_id"`
	Order      Order    `json:"-" gorm:"foreignKey:OrderID"`
	MenuItemID uint     `json:"menu_item_id"`
	MenuItem   MenuItem `json:"-" gorm:"foreignKey:MenuItemID"`
	Quantity   int      `json:"quantity" binding:"required"`
	Price      float64  `json:"price"`
}
