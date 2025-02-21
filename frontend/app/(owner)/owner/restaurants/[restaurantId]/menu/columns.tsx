"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MenuItem } from "@/models/menu.interface";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<MenuItem>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => {
            const price = parseFloat(row.getValue("price"));
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(price);
            return formatted;
        },
    },
    {
        accessorKey: "category",
        header: "Category",
    },
    {
        accessorKey: "is_available",
        header: "Available",
        cell: ({ row }) => (row.original.is_available ? "Yes" : "No"),
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />,
    },
];
