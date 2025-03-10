"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    useGetOverviewQuery,
    useGetAnalyticsQuery,
    useGetReportsQuery,
} from "@/store/reducers/admin/api";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

const AdminPage = () => {
    const {
        data: overview,
        isLoading: overviewLoading,
        error: overviewError,
    } = useGetOverviewQuery();
    const {
        data: analytics,
        isLoading: analyticsLoading,
        error: analyticsError,
    } = useGetAnalyticsQuery();
    const {
        data: reports,
        isLoading: reportsLoading,
        error: reportsError,
    } = useGetReportsQuery();

    if (overviewLoading || analyticsLoading || reportsLoading)
        return <div>Loading...</div>;
    if (overviewError)
        return (
            <div>
                Error:{" "}
                {(overviewError as any).data?.message ||
                    "Failed to fetch overview"}
            </div>
        );
    if (analyticsError)
        return (
            <div>
                Error:{" "}
                {(analyticsError as any).data?.message ||
                    "Failed to fetch analytics"}
            </div>
        );
    if (reportsError)
        return (
            <div>
                Error:{" "}
                {(reportsError as any).data?.message ||
                    "Failed to fetch reports"}
            </div>
        );

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Users
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {overview?.total_users}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Orders
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {overview?.total_orders}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Revenue
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    ${overview?.total_revenue.toFixed(2)}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Active Restaurants
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {overview?.active_restaurants}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Analytics Tab */}
                <TabsContent value="analytics" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {/* Daily Orders Chart */}
                        <Card className="col-span-3 md:col-span-1">
                            <CardHeader>
                                <CardTitle>Daily Orders</CardTitle>
                            </CardHeader>
                            <CardContent className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={analytics?.daily_orders.map(
                                            (item) => ({
                                                date: new Date(
                                                    item.date
                                                ).toLocaleDateString(),
                                                orders: item.count,
                                            })
                                        )}
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="orders"
                                            stroke="#8884d8"
                                            activeDot={{ r: 8 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Popular Items Chart */}
                        <Card className="col-span-3 md:col-span-1">
                            <CardHeader>
                                <CardTitle>Popular Items</CardTitle>
                            </CardHeader>
                            <CardContent className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={analytics?.popular_items.map(
                                            (item) => ({
                                                name: item.name,
                                                orders: item.order_count,
                                            })
                                        )}
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="orders" fill="#82ca9d" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Monthly Revenue Chart */}
                        <Card className="col-span-3 md:col-span-1">
                            <CardHeader>
                                <CardTitle>Monthly Revenue</CardTitle>
                            </CardHeader>
                            <CardContent className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={analytics?.revenue_by_month.map(
                                            (item) => ({
                                                month: new Date(
                                                    item.month
                                                ).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    year: "numeric",
                                                }),
                                                revenue: item.revenue,
                                            })
                                        )}
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="revenue" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Reports Tab */}
                <TabsContent value="reports" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {/* Recent Orders Table */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Orders</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Order ID</TableHead>
                                            <TableHead>User</TableHead>
                                            <TableHead>Restaurant</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reports?.recent_orders.map((order) => (
                                            <TableRow key={order.id}>
                                                <TableCell>
                                                    {order.id}
                                                </TableCell>
                                                <TableCell>
                                                    {order.user.name}
                                                </TableCell>
                                                <TableCell>
                                                    {order.restaurant.name}
                                                </TableCell>
                                                <TableCell>
                                                    $
                                                    {order.total_amount.toFixed(
                                                        2
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {order.status}
                                                </TableCell>
                                                <TableCell>
                                                    {format(
                                                        new Date(
                                                            order.created_at
                                                        ),
                                                        "MMM dd, yyyy"
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {/* User Activity Table */}
                        <Card>
                            <CardHeader>
                                <CardTitle>User Activity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>User</TableHead>
                                            <TableHead>Orders</TableHead>
                                            <TableHead>Total Spent</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reports?.user_activity.map(
                                            (activity) => (
                                                <TableRow key={activity.name}>
                                                    <TableCell>
                                                        {activity.name}
                                                    </TableCell>
                                                    <TableCell>
                                                        {activity.order_count}
                                                    </TableCell>
                                                    <TableCell>
                                                        $
                                                        {activity.total_spent.toFixed(
                                                            2
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {/* Restaurant Stats Table */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Restaurant Stats</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Restaurant</TableHead>
                                            <TableHead>Orders</TableHead>
                                            <TableHead>Rating</TableHead>
                                            <TableHead>Revenue</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reports?.restaurant_stats.map(
                                            (stat) => (
                                                <TableRow key={stat.name}>
                                                    <TableCell>
                                                        {stat.name}
                                                    </TableCell>
                                                    <TableCell>
                                                        {stat.order_count}
                                                    </TableCell>
                                                    <TableCell>
                                                        {stat.avg_rating.toFixed(
                                                            1
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        $
                                                        {stat.total_revenue.toFixed(
                                                            2
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminPage;
