"use client";

import { useGetMenuItemsQuery } from "@/store/reducers/menu/api";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

export default function MenuPage({
    params,
}: {
    params: { restaurantId: string };
}) {
    const { data, isLoading } = useGetMenuItemsQuery(params.restaurantId);
    const router = useRouter();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">
                    Menu Items
                </h2>
                <Button
                    onClick={() =>
                        router.push(
                            `/admin/restaurants/${params.restaurantId}/menu/new`
                        )
                    }
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New
                </Button>
            </div>
            <DataTable
                columns={columns}
                data={data?.data || []}
                isLoading={isLoading}
            />
        </div>
    );
}
