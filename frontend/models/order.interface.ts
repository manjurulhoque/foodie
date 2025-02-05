export interface Order {
    id: number;
    user_id: number;
    restaurant_id: number;
    total_amount: number;
    status: OrderStatus;
    payment_status: PaymentStatus;
    payment_method: string;
    delivery_address: string;
    items: OrderItem[];
    created_at: string;
    updated_at: string;
}

export interface OrderItem {
    id: number;
    order_id: number;
    menu_item_id: number;
    menu_item: {
        id: number;
        name: string;
        price: number;
    };
    quantity: number;
    price: number;
}

export enum OrderStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    PREPARING = "preparing",
    READY = "ready",
    DELIVERED = "delivered",
    CANCELLED = "cancelled",
}

export enum PaymentStatus {
    PENDING = "pending",
    PAID = "paid",
    FAILED = "failed",
}
