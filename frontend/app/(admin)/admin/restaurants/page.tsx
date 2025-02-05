"use client";

import { useGetRestaurantsQuery } from "@/store/reducers/restaurant/api";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

export default function RestaurantsPage() {
    const { data, isLoading } = useGetRestaurantsQuery();
    const restaurants = data?.data?.data || [];
    const router = useRouter();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">
                    Restaurants
                </h2>
                <Button onClick={() => router.push("/admin/restaurants/new")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New
                </Button>
            </div>
            <DataTable
                columns={columns}
                data={restaurants}
                isLoading={isLoading}
            />
        </div>
    );
}
