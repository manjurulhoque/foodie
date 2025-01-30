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
    is_active: boolean;
    user_id: string;
    menu_items: MenuItem[];
    created_at: string;
    updated_at: string;
}

export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    is_available: boolean;
    restaurant_id: string;
    created_at: string;
    updated_at: string;
}
