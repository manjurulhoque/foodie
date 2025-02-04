"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Order } from "@/models/order.interface";
import { format, subDays } from "date-fns";

interface OverviewProps {
    data: Order[];
}

export function Overview({ data }: OverviewProps) {
    // Process data for the chart - last 7 days
    const chartData = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), i);
        const ordersForDay = data.filter(
            (order) =>
                format(new Date(order.created_at), "yyyy-MM-dd") ===
                format(date, "yyyy-MM-dd")
        );
        const total = ordersForDay.reduce((acc, order) => acc + order.total, 0);

        return {
            name: format(date, "EEE"),
            total: total,
        };
    }).reverse();

    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
                <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                />
                <Bar
                    dataKey="total"
                    fill="currentColor"
                    radius={[4, 4, 0, 0]}
                    className="fill-primary"
                />
            </BarChart>
        </ResponsiveContainer>
    );
}
