"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MenuItem } from "@/models/restaurant.interface";
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
        cell: ({ row }) => `$${row.original.price.toFixed(2)}`,
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
