export interface Restaurant {
    id: string;
    name: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    cuisine: string;
    rating: number;
    image: string;
    isActive: boolean;
    userId: string;
    menuItems: MenuItem[];
    createdAt: string;
    updatedAt: string;
}

export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    is_available: boolean;
    restaurantId: string;
    createdAt: string;
    updatedAt: string;
}
