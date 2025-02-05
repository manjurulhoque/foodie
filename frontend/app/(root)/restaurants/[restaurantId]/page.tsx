"use client";

import { useGetRestaurantQuery } from "@/store/reducers/restaurant/api";
import { useGetRestaurantMenuItemsQuery } from "@/store/reducers/menu/api";
import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Star, Clock, UtensilsCrossed } from "lucide-react";
import { RestaurantDetailSkeleton } from "@/components/skeleton/restaurant-detail.skeleton";
import { MenuItem } from "@/models/restaurant.interface";
import { MenuItemCard } from "@/components/menu/menu-item-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import MenuItemSkeleton from "@/components/skeleton/menu-item.skeleton";
import { EmptyState } from "@/components/shared/empty-state";

export default function RestaurantPage({
    params,
}: {
    params: { restaurantId: string };
}) {
    const { data: restaurant, isLoading: isRestaurantLoading } =
        useGetRestaurantQuery(params.restaurantId);
    const { data: menuItems, isLoading: isMenuLoading } =
        useGetRestaurantMenuItemsQuery(parseInt(params.restaurantId));
    const [activeCategory, setActiveCategory] = useState<string>("all");

    if (isRestaurantLoading) {
        return <RestaurantDetailSkeleton />;
    }

    const categories = [
        "all",
        ...Array.from(
            new Set(
                menuItems?.data.map((item: MenuItem) =>
                    item.category.toLowerCase()
                )
            )
        ),
    ];

    const filteredItems =
        activeCategory === "all"
            ? menuItems?.data
            : menuItems?.data.filter(
                  (item: MenuItem) =>
                      item.category.toLowerCase() === activeCategory
              );

    const getImageUrl = (path: string) => {
        if (!path) {
            return "/img/placeholder.svg";
        }
        return `${process.env.BACKEND_BASE_URL}/${path}`;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative h-[300px] w-full">
                <Image
                    src={getImageUrl(restaurant?.data.image || "")}
                    alt={restaurant?.data.name || ""}
                    fill
                    className="object-cover brightness-50"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                        <h1 className="text-4xl font-bold">
                            {restaurant?.data.name}
                        </h1>
                        <div className="mt-4 flex items-center justify-center gap-4">
                            <Badge className="flex items-center gap-1 bg-white/20 text-white">
                                <Star className="h-3 w-3" />
                                {restaurant?.data.rating}
                            </Badge>
                            <div className="flex flex-wrap gap-2">
                                {restaurant?.data.cuisines.map((cuisine) => (
                                    <Badge key={cuisine.id} variant="secondary">
                                        {cuisine.name}
                                    </Badge>
                                ))}
                            </div>
                            <Badge className="flex items-center gap-1 bg-white/20 text-white">
                                <Clock className="h-3 w-3" />
                                30-45 min
                            </Badge>
                        </div>
                        <div className="mt-2 flex items-center justify-center gap-2 text-sm">
                            <MapPin className="h-4 w-4" />
                            {restaurant?.data.address}
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Section */}
            <div className="container mx-auto -mt-10 px-4">
                <Card className="relative">
                    <div className="flex">
                        {/* Categories Sidebar */}
                        <div className="w-64 border-r p-4">
                            <h2 className="mb-4 font-semibold">Categories</h2>
                            <ScrollArea className="h-[600px]">
                                <div className="space-y-2 pr-4">
                                    {categories.map((category) => (
                                        <Button
                                            key={category}
                                            variant={
                                                activeCategory === category
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            className="w-full justify-start"
                                            onClick={() =>
                                                setActiveCategory(category)
                                            }
                                        >
                                            {category.charAt(0).toUpperCase() +
                                                category.slice(1)}
                                        </Button>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>

                        {/* Menu Items Grid */}
                        <div className="flex-1 p-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {isMenuLoading ? (
                                    <>
                                        {[...Array(6)].map((_, i) => (
                                            <MenuItemSkeleton key={i} />
                                        ))}
                                    </>
                                ) : filteredItems?.length === 0 ? (
                                    <div className="col-span-2">
                                        <EmptyState
                                            title="No menu items found"
                                            description={
                                                activeCategory === "all"
                                                    ? "This restaurant hasn't added any menu items yet."
                                                    : `No menu items found in the ${activeCategory} category.`
                                            }
                                        />
                                    </div>
                                ) : (
                                    filteredItems?.map((item: MenuItem) => (
                                        <MenuItemCard
                                            key={item.id}
                                            menuItem={item}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
