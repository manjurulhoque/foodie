"use client";

import { useGetUserOrdersQuery } from "@/store/reducers/order/api";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Spinner from "@/components/shared/spinner";
import { OrderStatus, PaymentStatus } from "@/models/order.interface";
import { EmptyState } from "@/components/shared/empty-state";

export default function DashboardOrdersPage() {
    const { data, isLoading } = useGetUserOrdersQuery();
    const orders = data?.data ?? [];

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <EmptyState
                title="No Orders Yet"
                description="You haven't placed any orders yet. Start ordering delicious food!"
            />
        );
    }

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

    const getPaymentStatusColor = (status: PaymentStatus) => {
        switch (status) {
            case PaymentStatus.PAID:
                return "bg-green-500";
            case PaymentStatus.PENDING:
                return "bg-yellow-500";
            case PaymentStatus.FAILED:
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    };

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
            <div className="grid gap-4">
                {orders?.map((order) => (
                    <Card key={order.id}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Order #{order.id}</CardTitle>
                                    <CardDescription>
                                        {format(
                                            new Date(order.created_at),
                                            "PPpp"
                                        )}
                                    </CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    Order Status:
                                    <Badge
                                        className={getStatusColor(
                                            order.status as OrderStatus
                                        )}
                                    >
                                        {order.status}
                                    </Badge>
                                    Payment Status:
                                    <Badge
                                        className={getPaymentStatusColor(
                                            order.payment_status as PaymentStatus
                                        )}
                                    >
                                        {order.payment_status}
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {order.items?.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between"
                                    >
                                        <span>
                                            {item.quantity}x{" "}
                                            {item.menu_item.name}
                                        </span>
                                        <span>
                                            $
                                            {(
                                                item.price * item.quantity
                                            ).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                                <Separator />
                                <div className="flex justify-between font-bold">
                                    <span>Total</span>
                                    <span>${order.total_amount.toFixed(2)}</span>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    <p>Delivery Address: {order.delivery_address}</p>
                                    <p>Payment Method: {order.payment_method}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
