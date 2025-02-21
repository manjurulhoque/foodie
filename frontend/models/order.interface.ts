import { Restaurant } from "./restaurant.interface";
import { User } from "./user.interface";

export interface Order {
    id: number;
    user_id: number;
    restaurant_id: number;
    total_amount: number;
    status: "pending" | "preparing" | "ready" | "delivered" | "cancelled";
    payment_status: "pending" | "paid" | "failed";
    created_at: string;
    updated_at: string;
    restaurant: Restaurant;
    user: User;
    items: OrderItem[];
}

export interface OrderItem {
    id: number;
    order_id: number;
    menu_item_id: number;
    quantity: number;
    price: number;
    created_at: string;
    updated_at: string;
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
