"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Order } from "@/models/order.interface";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import UpdateOrderStatusDialog from "@/components/dialog/update-order-status-dialog";
import { useGetOwnerOrdersQuery } from "@/store/reducers/owner/api";

export default function OwnerOrdersPage() {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const { data: orders, isLoading, error, refetch } = useGetOwnerOrdersQuery();
    

    const handleUpdateClick = (order: Order) => {
        setSelectedOrder(order);
        setIsUpdateDialogOpen(true);
    };

    const handleUpdateSuccess = () => {
        setIsUpdateDialogOpen(false);
        refetch();
        toast.success("Order status updated successfully");
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Restaurant Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Restaurant</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Total Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Order Date</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && <TableRow><TableCell colSpan={7} className="h-24 text-center">Loading...</TableCell></TableRow>}
                            {!isLoading && orders?.data?.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>#{order.id}</TableCell>
                                    <TableCell>
                                        {order.restaurant.name}
                                    </TableCell>
                                    <TableCell>{order.user.name}</TableCell>
                                    <TableCell>${order.total_amount}</TableCell>
                                    <TableCell className="capitalize">
                                        {order.status}
                                    </TableCell>
                                    <TableCell>
                                        {formatDate(order.created_at)}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                handleUpdateClick(order)
                                            }
                                        >
                                            Update Status
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {selectedOrder && (
                <UpdateOrderStatusDialog
                    order={selectedOrder}
                    open={isUpdateDialogOpen}
                    onOpenChange={setIsUpdateDialogOpen}
                    onSuccess={handleUpdateSuccess}
                />
            )}
        </div>
    );
}
