"use client";

import { useGetCustomersQuery } from "@/store/reducers/customer/api";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

export default function CustomersPage() {
    const { data, isLoading } = useGetCustomersQuery();
    const customers = data?.data || [];

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
            </div>
            <DataTable
                columns={columns}
                data={customers}
                isLoading={isLoading}
            />
        </div>
    );
}
