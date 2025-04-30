"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetRestaurantMenuItemsQuery } from "@/store/reducers/owner/api";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { MenuItem } from "@/models/menu-item.interface";

export default function MenuItemsPage() {
    const {
        data: menuItemsResponse,
        isLoading,
        error,
        refetch,
    } = useGetRestaurantMenuItemsQuery();

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Menu Items</h1>
                <Link href="/owner/menu/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Item
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Menu Items</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="h-24 text-center"
                                    >
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            )}
                            {!isLoading &&
                                menuItemsResponse?.data?.map(
                                    (item: MenuItem) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">
                                                {item.name}
                                            </TableCell>
                                            <TableCell>
                                                {item.description}
                                            </TableCell>
                                            <TableCell>${item.price}</TableCell>
                                            <TableCell>
                                                {item.category}
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs ${
                                                        item.is_available
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {item.is_available
                                                        ? "Available"
                                                        : "Unavailable"}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/owner/menu/${item.id}/edit`}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
