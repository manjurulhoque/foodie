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
import { Edit, MoreHorizontal, Trash, Utensils } from "lucide-react";
import { Restaurant } from "@/models/restaurant.interface";
import { useDeleteRestaurantMutation } from "@/store/reducers/restaurant/api";

interface CellActionProps {
    data: Restaurant;
}

export function CellAction({ data }: CellActionProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [deleteRestaurant] = useDeleteRestaurantMutation();

    const onDelete = async () => {
        try {
            await deleteRestaurant(data.id);
        } catch (error) {
            console.log(error);
        }
    };

    return (
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
                    onClick={() =>
                        router.push(`/admin/restaurants/${data.id}/menu`)
                    }
                >
                    <Utensils className="mr-2 h-4 w-4" />
                    Menu
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() =>
                        router.push(`/admin/restaurants/${data.id}/edit`)
                    }
                >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete}>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
