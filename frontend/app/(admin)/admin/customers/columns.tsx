"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Customer } from "@/models/customer.interface";
import { format } from "date-fns";

export const columns: ColumnDef<Customer>[] = [
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
        accessorKey: "total_orders",
        header: "Total Orders",
    },
    {
        accessorKey: "total_spent",
        header: "Total Spent",
        cell: ({ row }) => `$${row.original.total_spent.toFixed(2)}`,
    },
    {
        accessorKey: "last_order",
        header: "Last Order",
        cell: ({ row }) =>
            row.original.last_order
                ? format(new Date(row.original.last_order), "PPp")
                : "Never",
    },
];
