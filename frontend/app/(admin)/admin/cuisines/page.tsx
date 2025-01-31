"use client";

import { useGetCuisinesQuery } from "@/store/reducers/cuisine/api";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

export default function CuisinesPage() {
    const { data, isLoading } = useGetCuisinesQuery();
    const router = useRouter();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Cuisines</h2>
                <Button onClick={() => router.push("/admin/cuisines/new")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New
                </Button>
            </div>
            <DataTable
                columns={columns}
                data={data?.data || []}
                isLoading={isLoading}
            />
        </div>
    );
}
