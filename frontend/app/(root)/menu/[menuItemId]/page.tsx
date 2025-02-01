"use client";

import { useGetMenuItemQuery } from "@/store/reducers/menu/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, ShoppingCart, Star, Clock, Tag, Heart } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import RelatedItems from "./related-items";
import Spinner from "@/components/shared/spinner";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";

export default function MenuItemPage({
    params,
}: {
    params: { menuItemId: string };
}) {
    const { data: menuItem, isLoading } = useGetMenuItemQuery(
        params.menuItemId
    );
    const [quantity, setQuantity] = useState(1);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (!menuItem?.data) {
        return <div>Menu item not found</div>;
    }

    const handleAddToCart = () => {
        toast.success("Added to cart successfully!");
    };

    const getImageUrl = () => {
        if (!menuItem.data.image) {
            return "/img/placeholder.svg";
        }
        return `${process.env.BACKEND_BASE_URL}/${menuItem.data.image}`;
    };

    return (
        <div className="grid md:grid-cols-2 gap-6 lg:gap-12 items-start max-w-6xl px-4 mx-auto py-6">
            <div className="grid gap-4">
                <div className="relative h-[400px] overflow-hidden rounded-lg border">
                    <Image
                        src={getImageUrl()}
                        alt={menuItem.data.name}
                        fill
                        className="object-cover"
                    />
                    {!menuItem.data.is_available && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white text-lg font-semibold">
                                Out of Stock
                            </span>
                        </div>
                    )}
                </div>
            </div>
            <div className="grid gap-4 md:gap-10">
                <div className="grid gap-4">
                    <h1 className="font-bold text-3xl lg:text-4xl">
                        {menuItem.data.name}
                    </h1>
                    <p className="text-muted-foreground">
                        {menuItem.data.description}
                    </p>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-0.5">
                            <Star className="w-5 h-5 fill-primary" />
                            <Star className="w-5 h-5 fill-primary" />
                            <Star className="w-5 h-5 fill-primary" />
                            <Star className="w-5 h-5 fill-muted stroke-muted-foreground" />
                            <Star className="w-5 h-5 fill-muted stroke-muted-foreground" />
                        </div>
                        <div className="text-sm text-muted-foreground">
                            (12 reviews)
                        </div>
                    </div>
                    <div className="text-4xl font-bold">
                        ${menuItem.data.price.toFixed(2)}
                    </div>
                </div>
                <div className="grid gap-4">
                    <div className="flex items-center gap-4">
                        <Badge
                            variant="secondary"
                            className="flex items-center gap-1"
                        >
                            <Tag className="w-4 h-4" />
                            {menuItem.data.category}
                        </Badge>
                        <Badge
                            variant="secondary"
                            className="flex items-center gap-1"
                        >
                            <Clock className="w-4 h-4" />
                            15-20 min
                        </Badge>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                                quantity > 1 && setQuantity(quantity - 1)
                            }
                            disabled={
                                quantity === 1 || !menuItem.data.is_available
                            }
                        >
                            <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-xl font-semibold">
                            {quantity}
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setQuantity(quantity + 1)}
                            disabled={!menuItem.data.is_available}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            className="w-full"
                            size="lg"
                            onClick={handleAddToCart}
                            disabled={!menuItem.data.is_available}
                        >
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            {menuItem.data.is_available
                                ? `Add to Cart - $${(
                                    menuItem.data.price * quantity
                                ).toFixed(2)}`
                                : "Out of Stock"}
                        </Button>
                        <Button variant="outline" size="lg" className="w-full">
                            <Heart className="mr-2 h-4 w-4" />
                            Add to Favorites
                        </Button>
                    </div>
                </div>
            </div>

            {/* Related Items Section */}
            <div className="md:col-span-2 mt-8">
                <h2 className="font-bold text-2xl mb-6">You May Also Like</h2>
                <RelatedItems
                    restaurantId={menuItem.data.restaurant_id}
                    currentItemId={menuItem.data.id}
                    category={menuItem.data.category}
                />
            </div>
        </div>
    );
}
