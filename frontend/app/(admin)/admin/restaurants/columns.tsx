"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Restaurant } from "@/models/restaurant.interface";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<Restaurant>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "phone",
        header: "Phone",
    },
    {
        accessorKey: "address",
        header: "Address",
    },
    {
        accessorKey: "cuisine",
        header: "Cuisine",
    },
    {
        accessorKey: "rating",
        header: "Rating",
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />,
    },
];
