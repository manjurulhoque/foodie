"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MenuItem } from "@/models/menu.interface";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import { useDeleteMenuItemMutation } from "@/store/reducers/menu/api";
import { extractMessage } from "@/lib/utils";
import EditMenuItemDialog from "@/components/dialog/edit-menu-item-dialog";

interface CellActionProps {
    data: MenuItem;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
    const router = useRouter();
    const params = useParams();
    const restaurantId = parseInt(params.restaurantId as string);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [deleteMenuItem] = useDeleteMenuItemMutation();

    const onDelete = async () => {
        try {
            // const response = await deleteMenuItem({
            //     restaurantId: restaurantId.toString(),
            //     menuId: data.id.toString(),
            // }).unwrap();
            toast.success("Menu item deleted successfully");
        } catch (error: any) {
            toast.error(
                error.data
                    ? extractMessage(error.data)
                    : "Error deleting menu item"
            );
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
                        onClick={() => router.push(`/owner/restaurants/${restaurantId}/menu/${data.id}/edit`)}
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

            <EditMenuItemDialog
                menuItem={data}
                restaurantId={restaurantId}
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
            />
        </>
    );
};
