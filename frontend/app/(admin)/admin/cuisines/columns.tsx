"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Cuisine } from "@/models/cuisine.interface";
import { CellAction } from "./cell-action";
import { format } from "date-fns";

export const columns: ColumnDef<Cuisine>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "is_active",
        header: "Status",
        cell: ({ row }) => (row.original.is_active ? "Active" : "Inactive"),
    },
    {
        accessorKey: "created_at",
        header: "Created At",
        cell: ({ row }) => format(new Date(row.original.created_at), "PPp"),
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />,
    },
];
