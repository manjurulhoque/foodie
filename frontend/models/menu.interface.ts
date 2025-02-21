export interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    is_available: boolean;
    restaurant_id: number;
    cuisine_id?: number;
    created_at: string;
    updated_at: string;
}
