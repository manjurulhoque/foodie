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
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { MenuItem } from "@/models/restaurant.interface";
import { useDeleteMenuItemMutation } from "@/store/reducers/menu/api";

interface CellActionProps {
    data: MenuItem;
}

export function CellAction({ data }: CellActionProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [deleteMenuItem] = useDeleteMenuItemMutation();

    const onDelete = async () => {
        try {
            await deleteMenuItem(data.id);
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
                    className="cursor-pointer"
                    onClick={() =>
                        router.push(
                            `/admin/restaurants/${data.restaurantId}/menu/${data.id}/edit`
                        )
                    }
                >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={onDelete}>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
