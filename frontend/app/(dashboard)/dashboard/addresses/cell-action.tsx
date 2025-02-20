"use client";

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
import { Address } from "@/models/address.interface";
import { useDeleteAddressMutation } from "@/store/reducers/address/api";
import { toast } from "react-hot-toast";

interface CellActionProps {
    data: Address;
}

export function CellAction({ data }: CellActionProps) {
    const router = useRouter();
    const [deleteAddress] = useDeleteAddressMutation();

    const onDelete = async () => {
        try {
            await deleteAddress(data.id).unwrap();
            toast.success("Address deleted successfully");
        } catch (error) {
            toast.error("Something went wrong");
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
                        router.push(`/dashboard/addresses/${data.id}/edit`)
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
