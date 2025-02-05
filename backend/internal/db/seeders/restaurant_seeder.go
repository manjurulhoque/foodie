package seeders

import (
	"fmt"

	"github.com/manjurulhoque/foodie/backend/internal/models"
	"gorm.io/gorm"
)

var restaurants = []models.Restaurant{
	{
		Name:        "La Piazza",
		Description: "Authentic Italian cuisine in a cozy atmosphere",
		Address:     "123 Main St, Downtown",
		Phone:       "+1234567890",
		Email:       "info@lapiazza.com",
		IsActive:    true,
		Rating:      4.5,
		Image:       "",
		Cuisines:    []*models.Cuisine{},
	},
	{
		Name:        "Dragon Palace",
		Description: "Traditional Chinese dishes with modern flair",
		Address:     "456 Oak Ave, Chinatown",
		Phone:       "+1234567891",
		Email:       "info@dragonpalace.com",
		IsActive:    true,
		Rating:      4.3,
		Image:       "",
		Cuisines:    []*models.Cuisine{},
	},
	{
		Name:        "Sushi Zen",
		Description: "Authentic Japanese sushi and ramen",
		Address:     "789 Cherry Ln, Japantown",
		Phone:       "+1234567892",
		Email:       "info@sushizen.com",
		IsActive:    true,
		Rating:      4.7,
		Image:       "",
		Cuisines:    []*models.Cuisine{},
	},
	{
		Name:        "Taj Mahal",
		Description: "Fine Indian dining with traditional flavors",
		Address:     "321 Spice St, Little India",
		Phone:       "+1234567893",
		Email:       "info@tajmahal.com",
		IsActive:    true,
		Rating:      4.4,
		Image:       "",
		Cuisines:    []*models.Cuisine{},
	},
	{
		Name:        "El Mariachi",
		Description: "Authentic Mexican cuisine and margaritas",
		Address:     "567 Salsa Ave, Mexican Quarter",
		Phone:       "+1234567894",
		Email:       "info@elmariachi.com",
		IsActive:    true,
		Rating:      4.6,
		Image:       "",
		Cuisines:    []*models.Cuisine{},
	},
	{
		Name:        "Thai Orchid",
		Description: "Traditional Thai dishes with spicy flavors",
		Address:     "890 Basil Rd, Thai Town",
		Phone:       "+1234567895",
		Email:       "info@thaiorchid.com",
		IsActive:    true,
		Rating:      4.5,
		Image:       "",
		Cuisines:    []*models.Cuisine{},
	},
	{
		Name:        "Le Bistro",
		Description: "Classic French cuisine in elegant setting",
		Address:     "432 Paris St, French Quarter",
		Phone:       "+1234567896",
		Email:       "info@lebistro.com",
		IsActive:    true,
		Rating:      4.8,
		Image:       "",
		Cuisines:    []*models.Cuisine{},
	},
	{
		Name:        "Olive Garden",
		Description: "Mediterranean dishes with fresh ingredients",
		Address:     "765 Olive Way, Mediterranean District",
		Phone:       "+1234567897",
		Email:       "info@olivegarden.com",
		IsActive:    true,
		Rating:      4.4,
		Image:       "",
		Cuisines:    []*models.Cuisine{},
	},
	{
		Name:        "Seoul Kitchen",
		Description: "Authentic Korean BBQ and traditional dishes",
		Address:     "234 Kimchi Ln, Koreatown",
		Phone:       "+1234567898",
		Email:       "info@seoulkitchen.com",
		IsActive:    true,
		Rating:      4.6,
		Image:       "",
		Cuisines:    []*models.Cuisine{},
	},
	{
		Name:        "Saigon Pho",
		Description: "Vietnamese noodles and street food",
		Address:     "876 Noodle St, Little Saigon",
		Phone:       "+1234567899",
		Email:       "info@saigonpho.com",
		IsActive:    true,
		Rating:      4.5,
		Image:       "",
		Cuisines:    []*models.Cuisine{},
	},
	{
		Name:        "Athens Taverna",
		Description: "Traditional Greek cuisine and mezedes",
		Address:     "123 Acropolis Ave, Greek Town",
		Phone:       "+1234567900",
		Email:       "info@athenstaverna.com",
		IsActive:    true,
		Rating:      4.6,
		Image:       "",
		Cuisines:    []*models.Cuisine{},
	},
	{
		Name:        "Tapas Bar",
		Description: "Authentic Spanish tapas and wines",
		Address:     "456 Barcelona St, Spanish Quarter",
		Phone:       "+1234567901",
		Email:       "info@tapasbar.com",
		IsActive:    true,
		Rating:      4.7,
		Image:       "",
		Cuisines:    []*models.Cuisine{},
	},
	{
		Name:        "Falafel House",
		Description: "Middle Eastern street food and grills",
		Address:     "789 Shawarma Rd, Middle Eastern District",
		Phone:       "+1234567902",
		Email:       "info@falafelhouse.com",
		IsActive:    true,
		Rating:      4.4,
		Image:       "",
		Cuisines:    []*models.Cuisine{},
	},
	{
		Name:        "Burger Joint",
		Description: "Classic American burgers and shakes",
		Address:     "321 Liberty Ave, Downtown",
		Phone:       "+1234567903",
		Email:       "info@burgerjoint.com",
		IsActive:    true,
		Rating:      4.3,
		Image:       "",
		Cuisines:    []*models.Cuisine{},
	},
	{
		Name:        "Churrascaria",
		Description: "Brazilian steakhouse and rodizio",
		Address:     "567 Rio St, Brazilian District",
		Phone:       "+1234567904",
		Email:       "info@churrascaria.com",
		IsActive:    true,
		Rating:      4.8,
		Image:       "",
		Cuisines:    []*models.Cuisine{},
	},
	{
		Name:        "Istanbul Kebab",
		Description: "Authentic Turkish kebabs and pide",
		Address:     "890 Bosphorus Rd, Turkish Quarter",
		Phone:       "+1234567905",
		Email:       "info@istanbulkebab.com",
		IsActive:    true,
		Rating:      4.5,
		Image:       "",
		Cuisines:    []*models.Cuisine{},
	},
	{
		Name:        "Beirut Nights",
		Description: "Lebanese mezze and grills",
		Address:     "432 Cedar St, Lebanese District",
		Phone:       "+1234567906",
		Email:       "info@beirutnights.com",
		IsActive:    true,
		Rating:      4.6,
		Image:       "",
		Cuisines:    []*models.Cuisine{},
	},
	{
		Name:        "Casablanca",
		Description: "Moroccan tagines and couscous",
		Address:     "765 Medina Way, Moroccan Quarter",
		Phone:       "+1234567907",
		Email:       "info@casablanca.com",
		IsActive:    true,
		Rating:      4.7,
		Image:       "",
		Cuisines:    []*models.Cuisine{},
	},
	{
		Name:        "Pasta Paradise",
		Description: "Homemade Italian pasta and sauces",
		Address:     "234 Venice Ln, Italian District",
		Phone:       "+1234567908",
		Email:       "info@pastaparadise.com",
		IsActive:    true,
		Rating:      4.5,
		Image:       "",
		Cuisines:    []*models.Cuisine{},
	},
	{
		Name:        "Dim Sum House",
		Description: "Traditional Chinese dim sum",
		Address:     "876 Canton St, Chinatown",
		Phone:       "+1234567909",
		Email:       "info@dimsumhouse.com",
		IsActive:    true,
		Rating:      4.4,
		Image:       "",
		Cuisines:    []*models.Cuisine{},
	},
	{
		Name:        "Ramen Bar",
		Description: "Authentic Japanese ramen and gyoza",
		Address:     "123 Tokyo Ave, Japantown",
		Phone:       "+1234567910",
		Email:       "info@ramenbar.com",
		IsActive:    true,
		Rating:      4.6,
		Image:       "",
		Cuisines:    []*models.Cuisine{},
	},
	{
		Name:        "Curry House",
		Description: "Spicy Indian curries and tandoori",
		Address:     "456 Mumbai St, Little India",
		Phone:       "+1234567911",
		Email:       "info@curryhouse.com",
		IsActive:    true,
		Rating:      4.5,
		Image:       "",
		Cuisines:    []*models.Cuisine{},
	},
	{
		Name:        "Taco Loco",
		Description: "Street-style Mexican tacos",
		Address:     "789 Tijuana Rd, Mexican Quarter",
		Phone:       "+1234567912",
		Email:       "info@tacoloco.com",
		IsActive:    true,
		Rating:      4.3,
		Image:       "",
		Cuisines:    []*models.Cuisine{},
	},
	{
		Name:        "Bangkok Street",
		Description: "Authentic Thai street food",
		Address:     "321 Bangkok Ave, Thai Town",
		Phone:       "+1234567913",
		Email:       "info@bangkokstreet.com",
		IsActive:    true,
		Rating:      4.4,
		Image:       "",
		Cuisines:    []*models.Cuisine{},
	},
	{
		Name:        "Paris Cafe",
		Description: "French pastries and cafe cuisine",
		Address:     "567 Champs St, French Quarter",
		Phone:       "+1234567914",
		Email:       "info@pariscafe.com",
		IsActive:    true,
		Rating:      4.7,
		Image:       "",
		Cuisines:    []*models.Cuisine{},
	},
	{
		Name:        "Greek Islands",
		Description: "Fresh Mediterranean seafood",
		Address:     "890 Santorini Rd, Greek District",
		Phone:       "+1234567915",
		Email:       "info@greekislands.com",
		IsActive:    true,
		Rating:      4.6,
		Image:       "",
		Cuisines:    []*models.Cuisine{},
	},
	{
		Name:        "Seoul BBQ",
		Description: "Korean BBQ and traditional soups",
		Address:     "432 Seoul St, Koreatown",
		Phone:       "+1234567916",
		Email:       "info@seoulbbq.com",
		IsActive:    true,
		Rating:      4.5,
		Image:       "",
		Cuisines:    []*models.Cuisine{},
	},
	{
		Name:        "Hanoi Kitchen",
		Description: "Traditional Vietnamese cuisine",
		Address:     "765 Hanoi Way, Little Saigon",
		Phone:       "+1234567917",
		Email:       "info@hanoikitchen.com",
		IsActive:    true,
		Rating:      4.4,
		Image:       "",
		Cuisines:    []*models.Cuisine{},
	},
	{
		Name:        "Mediterranean Grill",
		Description: "Mixed Mediterranean cuisine",
		Address:     "234 Cyprus Ln, Mediterranean District",
		Phone:       "+1234567918",
		Email:       "info@mediterraneangrill.com",
		IsActive:    true,
		Rating:      4.5,
		Image:       "",
		Cuisines:    []*models.Cuisine{},
	},
	{
		Name:        "Spice Route",
		Description: "Fusion Asian cuisine",
		Address:     "876 Silk Rd, Asian Quarter",
		Phone:       "+1234567919",
		Email:       "info@spiceroute.com",
		IsActive:    true,
		Rating:      4.6,
		Image:       "",
		Cuisines:    []*models.Cuisine{},
	},
}

var menuItems = []struct {
	RestaurantIndex int
	Items           []models.MenuItem
}{
	{
		RestaurantIndex: 0, // La Piazza
		Items: []models.MenuItem{
			{
				Name:        "Margherita Pizza",
				Description: "Fresh tomatoes, mozzarella, and basil",
				Price:       12.99,
				IsAvailable: true,
				Image:       "menu/margherita-pizza.jpg",
				Category:    "Pizza",
			},
			{
				Name:        "Spaghetti Carbonara",
				Description: "Creamy pasta with pancetta and egg",
				Price:       14.99,
				IsAvailable: true,
				Image:       "menu/carbonara.jpg",
				Category:    "Pasta",
			},
			{
				Name:        "Fettuccine Alfredo",
				Description: "Creamy pasta with parmesan sauce",
				Price:       15.99,
				IsAvailable: true,
				Image:       "menu/fettuccine-alfredo.jpg",
				Category:    "Pasta",
			},
			{
				Name:        "Bruschetta",
				Description: "Toasted bread with tomatoes and herbs",
				Price:       8.99,
				IsAvailable: true,
				Image:       "menu/bruschetta.jpg",
				Category:    "Appetizers",
			},
			{
				Name:        "Lasagna",
				Description: "Layered pasta with meat and cheese",
				Price:       16.99,
				IsAvailable: true,
				Image:       "menu/lasagna.jpg",
				Category:    "Main Course",
			},
			{
				Name:        "Tiramisu",
				Description: "Classic Italian coffee-flavored dessert",
				Price:       7.99,
				IsAvailable: true,
				Image:       "menu/tiramisu.jpg",
				Category:    "Desserts",
			},
			{
				Name:        "Caprese Salad",
				Description: "Fresh mozzarella, tomatoes, and basil",
				Price:       9.99,
				IsAvailable: true,
				Image:       "menu/caprese-salad.jpg",
				Category:    "Salads",
			},
			{
				Name:        "Risotto Mushroom",
				Description: "Creamy rice with wild mushrooms",
				Price:       17.99,
				IsAvailable: true,
				Image:       "menu/risotto.jpg",
				Category:    "Main Course",
			},
			{
				Name:        "Gnocchi",
				Description: "Potato dumplings in tomato sauce",
				Price:       14.99,
				IsAvailable: true,
				Image:       "menu/gnocchi.jpg",
				Category:    "Pasta",
			},
			{
				Name:        "Minestrone Soup",
				Description: "Traditional Italian vegetable soup",
				Price:       6.99,
				IsAvailable: true,
				Image:       "menu/minestrone.jpg",
				Category:    "Soups",
			},
		},
	},
	{
		RestaurantIndex: 1, // Dragon Palace
		Items: []models.MenuItem{
			{
				Name:        "Kung Pao Chicken",
				Description: "Spicy diced chicken with peanuts",
				Price:       15.99,
				IsAvailable: true,
				Image:       "menu/kungpao-chicken.jpg",
				Category:    "Main Course",
			},
			{
				Name:        "Dim Sum Platter",
				Description: "Assorted steamed dumplings",
				Price:       18.99,
				IsAvailable: true,
				Image:       "menu/dimsum.jpg",
				Category:    "Appetizers",
			},
			{
				Name:        "Spring Rolls",
				Description: "Crispy vegetable spring rolls",
				Price:       6.99,
				IsAvailable: true,
				Image:       "menu/spring-rolls.jpg",
				Category:    "Appetizers",
			},
			{
				Name:        "Fried Rice",
				Description: "Classic Chinese fried rice with vegetables",
				Price:       11.99,
				IsAvailable: true,
				Image:       "menu/fried-rice.jpg",
				Category:    "Rice",
			},
			{
				Name:        "Sweet and Sour Pork",
				Description: "Crispy pork in sweet and sour sauce",
				Price:       16.99,
				IsAvailable: true,
				Image:       "menu/sweet-sour-pork.jpg",
				Category:    "Main Course",
			},
			{
				Name:        "Mapo Tofu",
				Description: "Spicy tofu with minced pork",
				Price:       13.99,
				IsAvailable: true,
				Image:       "menu/mapo-tofu.jpg",
				Category:    "Main Course",
			},
			{
				Name:        "Hot and Sour Soup",
				Description: "Traditional spicy and sour soup",
				Price:       7.99,
				IsAvailable: true,
				Image:       "menu/hot-sour-soup.jpg",
				Category:    "Soups",
			},
			{
				Name:        "Beef with Broccoli",
				Description: "Tender beef and broccoli in oyster sauce",
				Price:       17.99,
				IsAvailable: true,
				Image:       "menu/beef-broccoli.jpg",
				Category:    "Main Course",
			},
			{
				Name:        "Chow Mein",
				Description: "Stir-fried noodles with vegetables",
				Price:       12.99,
				IsAvailable: true,
				Image:       "menu/chow-mein.jpg",
				Category:    "Noodles",
			},
			{
				Name:        "Peking Duck",
				Description: "Signature crispy duck with pancakes",
				Price:       32.99,
				IsAvailable: true,
				Image:       "menu/peking-duck.jpg",
				Category:    "Specialties",
			},
		},
	},
	{
		RestaurantIndex: 5, // Seoul BBQ
		Items: []models.MenuItem{
			{
				Name:        "Bulgogi",
				Description: "Marinated beef barbecue",
				Price:       18.99,
				IsAvailable: true,
				Image:       "",
				Category:    "BBQ",
			},
			{
				Name:        "Kimchi Stew",
				Description: "Spicy stew with fermented cabbage",
				Price:       14.99,
				IsAvailable: true,
				Image:       "",
				Category:    "Stews",
			},
			{
				Name:        "Bibimbap",
				Description: "Mixed rice with vegetables and egg",
				Price:       15.99,
				IsAvailable: true,
				Image:       "",
				Category:    "Rice Dishes",
			},
			{
				Name:        "Korean Fried Chicken",
				Description: "Crispy chicken with sweet and spicy sauce",
				Price:       16.99,
				IsAvailable: true,
				Image:       "",
				Category:    "Main Course",
			},
			{
				Name:        "Japchae",
				Description: "Sweet potato noodles with vegetables",
				Price:       13.99,
				IsAvailable: true,
				Image:       "",
				Category:    "Noodles",
			},
		},
	},
	{
		RestaurantIndex: 6, // Hanoi Kitchen
		Items: []models.MenuItem{
			{
				Name:        "Pho",
				Description: "Traditional Vietnamese noodle soup",
				Price:       12.99,
				IsAvailable: true,
				Image:       "",
				Category:    "Soups",
			},
			{
				Name:        "Banh Mi",
				Description: "Vietnamese sandwich with grilled meat",
				Price:       8.99,
				IsAvailable: true,
				Image:       "",
				Category:    "Sandwiches",
			},
			{
				Name:        "Spring Rolls",
				Description: "Fresh rice paper rolls with shrimp",
				Price:       7.99,
				IsAvailable: true,
				Image:       "",
				Category:    "Appetizers",
			},
			{
				Name:        "Bun Cha",
				Description: "Grilled pork with noodles",
				Price:       14.99,
				IsAvailable: true,
				Image:       "",
				Category:    "Main Course",
			},
			{
				Name:        "Vietnamese Coffee",
				Description: "Strong coffee with condensed milk",
				Price:       4.99,
				IsAvailable: true,
				Image:       "",
				Category:    "Beverages",
			},
		},
	},
	{
		RestaurantIndex: 7, // Mediterranean Grill
		Items: []models.MenuItem{
			{
				Name:        "Mixed Grill Platter",
				Description: "Assorted grilled meats and vegetables",
				Price:       24.99,
				IsAvailable: true,
				Image:       "",
				Category:    "Main Course",
			},
			{
				Name:        "Hummus",
				Description: "Chickpea dip with olive oil",
				Price:       6.99,
				IsAvailable: true,
				Image:       "",
				Category:    "Appetizers",
			},
			{
				Name:        "Greek Salad",
				Description: "Fresh vegetables with feta cheese",
				Price:       9.99,
				IsAvailable: true,
				Image:       "",
				Category:    "Salads",
			},
			{
				Name:        "Falafel Wrap",
				Description: "Fried chickpea patties in pita",
				Price:       11.99,
				IsAvailable: true,
				Image:       "",
				Category:    "Wraps",
			},
			{
				Name:        "Baklava",
				Description: "Sweet pastry with nuts and honey",
				Price:       5.99,
				IsAvailable: true,
				Image:       "",
				Category:    "Desserts",
			},
		},
	},
	{
		RestaurantIndex: 8, // Spice Route
		Items: []models.MenuItem{
			{
				Name:        "Fusion Curry Bowl",
				Description: "Mixed Asian curry with rice",
				Price:       16.99,
				IsAvailable: true,
				Image:       "",
				Category:    "Main Course",
			},
			{
				Name:        "Asian Tapas Platter",
				Description: "Assorted small bites",
				Price:       19.99,
				IsAvailable: true,
				Image:       "",
				Category:    "Appetizers",
			},
			{
				Name:        "Spicy Noodle Stir-fry",
				Description: "Mixed noodles with vegetables",
				Price:       14.99,
				IsAvailable: true,
				Image:       "",
				Category:    "Noodles",
			},
			{
				Name:        "Fusion Sushi Roll",
				Description: "Creative mixed sushi rolls",
				Price:       15.99,
				IsAvailable: true,
				Image:       "",
				Category:    "Sushi",
			},
			{
				Name:        "Mango Sticky Rice",
				Description: "Sweet coconut rice with fresh mango",
				Price:       7.99,
				IsAvailable: true,
				Image:       "",
				Category:    "Desserts",
			},
		},
	},
}

func SeedRestaurants(db *gorm.DB) error {
	// Delete existing data
	if err := db.Exec("DELETE FROM menu_items").Error; err != nil {
		return err
	}
	if err := db.Exec("DELETE FROM restaurants").Error; err != nil {
		return err
	}

	// First get all cuisines
	var cuisines []models.Cuisine
	if err := db.Find(&cuisines).Error; err != nil {
		return err
	}

	// Create restaurants
	for _, restaurant := range restaurants {
		cuisinePointers := make([]*models.Cuisine, len(cuisines))
		for i := range cuisines {
			cuisinePointers[i] = &cuisines[i]
		}
		restaurant.Cuisines = cuisinePointers
		if err := db.Create(&restaurant).Error; err != nil {
			return err
		}
	}

	// Create menu items for each restaurant
	var createdRestaurants []models.Restaurant
	if err := db.Find(&createdRestaurants).Error; err != nil {
		return err
	}

	for _, menuGroup := range menuItems {
		if menuGroup.RestaurantIndex >= len(createdRestaurants) {
			continue
		}
		restaurantID := createdRestaurants[menuGroup.RestaurantIndex].ID
		for _, item := range menuGroup.Items {
			item.RestaurantID = restaurantID
			if err := db.Create(&item).Error; err != nil {
				return fmt.Errorf("error creating menu item for restaurant %d: %v", restaurantID, err)
			}
		}
	}

	return nil
}
