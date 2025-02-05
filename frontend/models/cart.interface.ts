export interface Cart {
    id: number;
    user_id: number;
    items: CartItem[];
    created_at: string;
    updated_at: string;
}

export interface CartItem {
    id: number;
    cart_id: number;
    menu_item_id: number;
    menu_item: {
        id: number;
        name: string;
        description: string;
        price: number;
        image: string;
        is_available: boolean;
        restaurant_id: number;
    };
    quantity: number;
}
