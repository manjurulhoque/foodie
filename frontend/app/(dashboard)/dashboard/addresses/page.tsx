"use client";

import { useGetAddressesQuery } from "@/store/reducers/address/api";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddressesPage() {
    const router = useRouter();
    const { data, isLoading } = useGetAddressesQuery();
    const addresses = data?.data || [];

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Addresses</h2>
                <Button onClick={() => router.push("/dashboard/addresses/new")}>
                    <Plus className="mr-2 h-4 w-4" /> Add New
                </Button>
            </div>
            <DataTable
                columns={columns}
                data={addresses}
                isLoading={isLoading}
            />
        </div>
    );
}
