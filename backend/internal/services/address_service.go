package services

import (
	"github.com/manjurulhoque/foodie/backend/internal/models"
	"github.com/manjurulhoque/foodie/backend/internal/repositories"
)

type AddressService interface {
	CreateAddress(address *models.Address) error
	UpdateAddress(id uint, address map[string]interface{}) error
	DeleteAddress(id uint) error
	GetUserAddresses(userID uint) ([]models.Address, error)
	GetAddress(id uint) (*models.Address, error)
}

type addressService struct {
	repo repositories.AddressRepository
}

func NewAddressService(repo repositories.AddressRepository) AddressService {
	return &addressService{repo: repo}
}

func (s *addressService) CreateAddress(address *models.Address) error {
	return s.repo.Create(address)
}

func (s *addressService) UpdateAddress(id uint, address map[string]interface{}) error {
	return s.repo.Update(id, address)
}

func (s *addressService) DeleteAddress(id uint) error {
	return s.repo.Delete(id)
}

func (s *addressService) GetUserAddresses(userID uint) ([]models.Address, error) {
	return s.repo.FindByUser(userID)
}

func (s *addressService) GetAddress(id uint) (*models.Address, error) {
	return s.repo.FindByID(id)
}
