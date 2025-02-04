"use client";

import { useGetUserOrdersQuery } from "@/store/reducers/order/api";
import { useMeQuery } from "@/store/reducers/user/api";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { OrderStatus } from "@/models/order.interface";
import Spinner from "@/components/shared/spinner";
import { RecentOrders } from "@/components/dashboard/recent-orders";
import { Overview } from "@/components/dashboard/overview";

export default function DashboardPage() {
    const { data: orders, isLoading: isOrdersLoading } =
        useGetUserOrdersQuery();
    const { data: user, isLoading: isUserLoading } = useMeQuery(null);

    if (isOrdersLoading || isUserLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Spinner />
            </div>
        );
    }

    const userOrders = orders?.data ?? [];
    const totalOrders = userOrders.length;
    const totalSpent = userOrders.reduce((acc, order) => acc + order.total, 0);
    const pendingOrders = userOrders.filter(
        (order) => order.status === OrderStatus.PENDING
    ).length;
    const deliveredOrders = userOrders.filter(
        (order) => order.status === OrderStatus.DELIVERED
    ).length;

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Orders
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {totalOrders}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    All time orders
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Spent
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    ${totalSpent.toFixed(2)}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    All time spending
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Pending Orders
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {pendingOrders}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Orders awaiting delivery
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Delivered Orders
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {deliveredOrders}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Successfully delivered orders
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Overview</CardTitle>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <Overview data={userOrders} />
                            </CardContent>
                        </Card>
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Recent Orders</CardTitle>
                                <CardDescription>
                                    Your recent orders across all restaurants
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RecentOrders orders={userOrders.slice(0, 5)} />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="orders" className="space-y-4">
                    {/* Orders content will be added here */}
                </TabsContent>
            </Tabs>
        </div>
    );
}
