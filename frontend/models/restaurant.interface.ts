import { Cuisine } from "./cuisine.interface";

export interface Restaurant {
    id: number;
    name: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    rating: number;
    image: string;
    is_active: boolean;
    is_open: boolean;
    user_id?: number;
    cuisines: Cuisine[];
    menu_items: MenuItem[];
    created_at: string;
    updated_at: string;
    working_hours: WorkingHour[];
}

export interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    is_available: boolean;
    restaurant_id: number;
    created_at: string;
    updated_at: string;
}

export interface WorkingHour {
    id: number;
    restaurant_id: number;
    day_of_week: number;
    open_time: string;
    close_time: string;
    is_closed: boolean;
    created_at: string;
    updated_at: string;
}
