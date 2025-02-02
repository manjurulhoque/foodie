package repositories

import (
	"github.com/manjurulhoque/foodie/backend/internal/models"
	"gorm.io/gorm"
)

type CartRepository struct {
	db *gorm.DB
}

func NewCartRepository(db *gorm.DB) CartRepository {
	return CartRepository{db: db}
}

func (r *CartRepository) FindByUser(userID uint) (*models.Cart, error) {
	var cart models.Cart
	err := r.db.Preload("Items.MenuItem").Where("user_id = ?", userID).First(&cart).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			// Create a new cart if one doesn't exist
			cart = models.Cart{UserID: userID}
			cartCreateErr := r.db.Create(&cart).Error
			if cartCreateErr != nil {
				return nil, cartCreateErr
			}
		} else {
			return nil, err
		}
	}
	return &cart, nil
}

func (r *CartRepository) FindItemsByCart(cartID uint) ([]models.CartItem, error) {
	var cartItems []models.CartItem
	err := r.db.Preload("MenuItem").Where("cart_id = ?", cartID).Find(&cartItems).Error
	if err != nil {
		return nil, err
	}
	return cartItems, nil
}

func (r *CartRepository) AddItem(cartID uint, menuItemID uint, quantity int) error {
	var cartItem models.CartItem
	err := r.db.Where("cart_id = ? AND menu_item_id = ?", cartID, menuItemID).First(&cartItem).Error
	if err == gorm.ErrRecordNotFound {
		// Create new cart item
		cartItem = models.CartItem{
			CartID:     cartID,
			MenuItemID: menuItemID,
			Quantity:   quantity,
		}
		return r.db.Create(&cartItem).Error
	}
	// Update existing cart item quantity
	cartItem.Quantity += quantity
	return r.db.Save(&cartItem).Error
}

func (r *CartRepository) UpdateItemQuantity(cartItemID uint, quantity int) error {
	return r.db.Model(&models.CartItem{}).Where("id = ?", cartItemID).Update("quantity", quantity).Error
}

func (r *CartRepository) RemoveItem(cartItemID uint) error {
	return r.db.Delete(&models.CartItem{}, cartItemID).Error
}

func (r *CartRepository) ClearCart(cartID uint) error {
	return r.db.Where("cart_id = ?", cartID).Delete(&models.CartItem{}).Error
}
