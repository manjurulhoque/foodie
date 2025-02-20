"use client";

import { useGetAllUsersQuery } from "@/store/reducers/user/api";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

export default function UsersPage() {
    const { data, isLoading } = useGetAllUsersQuery();
    const users = data?.data || [];

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Users</h2>
            </div>
            <DataTable columns={columns} data={users} isLoading={isLoading} />
        </div>
    );
}
