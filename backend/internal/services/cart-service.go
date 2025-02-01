package services

import (
	"github.com/manjurulhoque/foodie/backend/internal/models"
	"github.com/manjurulhoque/foodie/backend/internal/repositories"
)

type CartService struct {
	repo repositories.CartRepository
}

func NewCartService(repo repositories.CartRepository) CartService {
	return CartService{repo: repo}
}

func (s *CartService) GetUserCart(userID uint) (*models.Cart, error) {
	return s.repo.FindByUser(userID)
}

func (s *CartService) AddToCart(userID uint, menuItemID uint, quantity int) error {
	cart, err := s.repo.FindByUser(userID)
	if err != nil {
		return err
	}
	return s.repo.AddItem(cart.ID, menuItemID, quantity)
}

func (s *CartService) UpdateCartItemQuantity(cartItemID uint, quantity int) error {
	return s.repo.UpdateItemQuantity(cartItemID, quantity)
}

func (s *CartService) RemoveFromCart(cartItemID uint) error {
	return s.repo.RemoveItem(cartItemID)
}

func (s *CartService) ClearCart(cartID uint) error {
	return s.repo.ClearCart(cartID)
}
