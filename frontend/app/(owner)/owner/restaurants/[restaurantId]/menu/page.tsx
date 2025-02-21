"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
// import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { useGetRestaurantMenuItemsQuery } from "@/store/reducers/menu/api";
import AddMenuItemDialog from "@/components/dialog/add-menu-item-dialog";

export default function RestaurantMenuPage() {
    const router = useRouter();
    const params = useParams();
    const restaurantId = parseInt(params.restaurantId as string);
    const [isAddOpen, setIsAddOpen] = useState(false);

    const { data: menuItems, isLoading } = useGetRestaurantMenuItemsQuery(restaurantId);

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">
                        Menu Items
                    </h2>
                    <Button
                        onClick={() =>
                            router.push(
                                `/owner/restaurants/${params.restaurantId}/menu/new`
                            )
                        }
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add New
                    </Button>
                </div>
                <DataTable
                    columns={columns}
                    data={menuItems?.data || []}
                    isLoading={isLoading}
                />
                <AddMenuItemDialog
                    open={isAddOpen}
                    onOpenChange={setIsAddOpen}
                    restaurantId={restaurantId}
                />
            </div>
        </div>
    );
}
