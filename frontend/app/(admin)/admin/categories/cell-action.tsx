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
import { Category } from "@/models/category.interface";
import { toast } from "react-hot-toast";

interface CellActionProps {
    data: Category;
}

export function CellAction({ data }: CellActionProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);

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
                        router.push(`/admin/categories/${data.id}/edit`)
                    }
                >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
