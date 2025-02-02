"use client";

import { MenuItem } from "@/models/restaurant.interface";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useAddToCartMutation } from "@/store/reducers/cart/api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface MenuItemCardProps {
    menuItem: MenuItem;
}

export function MenuItemCard({ menuItem }: MenuItemCardProps) {
    const [addToCart, { isLoading }] = useAddToCartMutation();
    const router = useRouter();

    const handleAddToCart = async () => {
        try {
            await addToCart({
                menu_item_id: menuItem.id,
                quantity: 1,
            }).unwrap();
            toast.success("Added to cart");
        } catch (error) {
            toast.error("Failed to add to cart");
        }
    };

    const getImageUrl = (path: string) => {
        if (!path) {
            return "/img/placeholder.svg";
        }
        return `${process.env.BACKEND_BASE_URL}/${path}`;
    };

    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="flex">
                <div className="relative h-32 w-32 flex-shrink-0">
                    <Image
                        src={getImageUrl(menuItem.image)}
                        alt={menuItem.name}
                        fill
                        className="object-cover"
                    />
                </div>
                <CardContent className="flex flex-1 flex-col justify-between p-4">
                    <div>
                        <div className="flex items-start justify-between">
                            <h3 className="font-semibold">{menuItem.name}</h3>
                            <Badge
                                variant={
                                    menuItem.is_available
                                        ? "default"
                                        : "destructive"
                                }
                            >
                                {menuItem.is_available
                                    ? "Available"
                                    : "Sold Out"}
                            </Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                            {menuItem.description}
                        </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                        <span className="text-lg font-semibold">
                            ${menuItem.price.toFixed(2)}
                        </span>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                onClick={() =>
                                    router.push(`/menu/${menuItem.id}`)
                                }
                            >
                                View Details
                            </Button>
                            <Button
                                size="icon"
                                disabled={isLoading || !menuItem.is_available}
                                onClick={handleAddToCart}
                            >
                                <ShoppingCart className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </div>
        </Card>
    );
}
