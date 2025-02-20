"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Address } from "@/models/address.interface";
import { Badge } from "@/components/ui/badge";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<Address>[] = [
    {
        accessorKey: "label",
        header: "Label",
    },
    {
        accessorKey: "street",
        header: "Street",
    },
    {
        accessorKey: "city",
        header: "City",
    },
    {
        accessorKey: "state",
        header: "State",
    },
    {
        accessorKey: "postal_code",
        header: "Postal Code",
    },
    {
        accessorKey: "is_default",
        header: "Default",
        cell: ({ row }) =>
            row.original.is_default ? <Badge>Default</Badge> : null,
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />,
    },
];
