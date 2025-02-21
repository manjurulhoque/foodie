"use client";

import { useState } from "react";
import { Restaurant } from "@/models/restaurant.interface";
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
import { toast } from "react-hot-toast";
import UpdateRestaurantDialog from "@/components/dialog/update-restaurant-dialog";
import { useGetOwnerRestaurantsQuery } from "@/store/reducers/owner/api";
import { useRouter } from "next/navigation";

export default function OwnerRestaurantsPage() {
    const router = useRouter();
    const { data: restaurants, isLoading, error, refetch } = useGetOwnerRestaurantsQuery();
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

    const handleUpdateClick = (restaurant: Restaurant) => {
        setSelectedRestaurant(restaurant);
        setIsUpdateDialogOpen(true);
    };

    const handleUpdateSuccess = () => {
        setIsUpdateDialogOpen(false);
        refetch();
        toast.success("Restaurant updated successfully");
    };

    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader>
                    <CardTitle>My Restaurants</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Address</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && <TableRow><TableCell colSpan={5} className="text-center">Loading...</TableCell></TableRow>}
                            {!isLoading && restaurants?.data?.map((restaurant) => (
                                <TableRow key={restaurant.id}>
                                    <TableCell>{restaurant.name}</TableCell>
                                    <TableCell>
                                        {restaurant.description}
                                    </TableCell>
                                    <TableCell>{restaurant.address}</TableCell>
                                    <TableCell>
                                        {restaurant.is_active
                                            ? "Active"
                                            : "Inactive"}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mr-2"
                                            onClick={() =>
                                                handleUpdateClick(restaurant)
                                            }
                                        >
                                            Update
                                        </Button>
                                        <Button
                                            variant="default"
                                            size="sm"
                                            className="mr-2"
                                            onClick={() =>
                                                router.push(`/owner/restaurants/${restaurant.id}/menu`)
                                            }
                                        >
                                            View Menu
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {selectedRestaurant && (
                <UpdateRestaurantDialog
                    restaurant={selectedRestaurant}
                    open={isUpdateDialogOpen}
                    onOpenChange={setIsUpdateDialogOpen}
                    onSuccess={handleUpdateSuccess}
                />
            )}
        </div>
    );
}
