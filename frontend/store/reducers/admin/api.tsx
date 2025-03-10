import { createApi } from "@reduxjs/toolkit/query/react";
import DynamicBaseQuery from "@/store/dynamic-base-query";

interface AdminOverview {
    total_users: number;
    total_orders: number;
    total_revenue: number;
    active_restaurants: number;
}

interface DailyOrderStats {
    date: string;
    count: number;
}

interface PopularItem {
    name: string;
    order_count: number;
}

interface MonthlyRevenue {
    month: string;
    revenue: number;
}

interface AdminAnalytics {
    daily_orders: DailyOrderStats[];
    popular_items: PopularItem[];
    revenue_by_month: MonthlyRevenue[];
}

interface OrderReport {
    id: number;
    user_id: number;
    restaurant_id: number;
    total_amount: number;
    status: string;
    created_at: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
    restaurant: {
        id: number;
        name: string;
    };
}

interface UserActivity {
    name: string;
    order_count: number;
    total_spent: number;
}

interface RestaurantStat {
    name: string;
    order_count: number;
    avg_rating: number;
    total_revenue: number;
}

interface AdminReport {
    recent_orders: OrderReport[];
    user_activity: UserActivity[];
    restaurant_stats: RestaurantStat[];
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export const AdminApi = createApi({
    reducerPath: "adminApi",
    baseQuery: DynamicBaseQuery,
    endpoints: (builder) => ({
        getOverview: builder.query<AdminOverview, void>({
            query: () => ({
                url: "/admin/overview",
                method: "GET",
            }),
            transformResponse: (response: ApiResponse<AdminOverview>) =>
                response.data,
        }),
        getAnalytics: builder.query<AdminAnalytics, void>({
            query: () => ({
                url: "/admin/analytics",
                method: "GET",
            }),
            transformResponse: (response: ApiResponse<AdminAnalytics>) =>
                response.data,
        }),
        getReports: builder.query<AdminReport, void>({
            query: () => ({
                url: "/admin/reports",
                method: "GET",
            }),
            transformResponse: (response: ApiResponse<AdminReport>) =>
                response.data,
        }),
    }),
});

export const { useGetOverviewQuery, useGetAnalyticsQuery, useGetReportsQuery } =
    AdminApi;
