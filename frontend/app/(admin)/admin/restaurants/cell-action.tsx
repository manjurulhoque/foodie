"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
    Clock,
    Edit,
    MoreHorizontal,
    Trash,
    Utensils,
    User,
} from "lucide-react";
import { Restaurant } from "@/models/restaurant.interface";
import { useDeleteRestaurantMutation } from "@/store/reducers/restaurant/api";
import AddEditRestaurantOwnerDialog from "@/components/dialog/add-edit-restaurant-owner-dialog";
import { toast } from "react-hot-toast";

interface CellActionProps {
    data: Restaurant;
}

export function CellAction({ data }: CellActionProps) {
    const router = useRouter();
    const [deleteRestaurant] = useDeleteRestaurantMutation();
    const [isAddOwnerOpen, setIsAddOwnerOpen] = useState(false);

    const onDelete = async () => {
        try {
            await deleteRestaurant(data.id);
        } catch (error) {
            toast.error("Error deleting restaurant");
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => setIsAddOwnerOpen(true)}
                    >
                        <User className="mr-2 h-4 w-4" />
                        Add/Update Owner
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() =>
                            router.push(
                                `/admin/restaurants/${data.id}/working-hours`
                            )
                        }
                    >
                        <Clock className="mr-2 h-4 w-4" />
                        Working Hours
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() =>
                            router.push(`/admin/restaurants/${data.id}/menu`)
                        }
                    >
                        <Utensils className="mr-2 h-4 w-4" />
                        Menu
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() =>
                            router.push(`/admin/restaurants/${data.id}/edit`)
                        }
                    >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={onDelete}
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {isAddOwnerOpen && (
                <AddEditRestaurantOwnerDialog
                    open={isAddOwnerOpen}
                    setOpen={setIsAddOwnerOpen}
                    restaurantId={data.id}
                    onSuccess={() => {
                        setIsAddOwnerOpen(false);
                    }}
                />
            )}
        </>
    );
}
