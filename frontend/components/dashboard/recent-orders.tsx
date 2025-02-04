"use client";

import { Order, OrderStatus } from "@/models/order.interface";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface RecentOrdersProps {
    orders: Order[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.PENDING:
                return "bg-yellow-500";
            case OrderStatus.CONFIRMED:
                return "bg-blue-500";
            case OrderStatus.PREPARING:
                return "bg-purple-500";
            case OrderStatus.READY:
                return "bg-green-500";
            case OrderStatus.DELIVERED:
                return "bg-green-700";
            case OrderStatus.CANCELLED:
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    };

    return (
        <div className="space-y-8">
            {orders.map((order) => (
                <div key={order.id} className="flex items-center">
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                            Order #{order.id}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {format(new Date(order.created_at), "PPp")}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                            <Badge
                                className={getStatusColor(
                                    order.status as OrderStatus
                                )}
                            >
                                {order.status}
                            </Badge>
                            <span className="text-sm font-semibold">
                                ${order.total.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
