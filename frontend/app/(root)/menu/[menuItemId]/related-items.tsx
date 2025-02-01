"use client";

import { useGetRestaurantMenuItemsQuery } from "@/store/reducers/menu/api";
import { MenuItem } from "@/models/restaurant.interface";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import Spinner from "@/components/shared/spinner";
import toast from "react-hot-toast";

interface RelatedItemsProps {
    restaurantId: number;
    currentItemId: number;
    category: string;
}

export default function RelatedItems({
    restaurantId,
    currentItemId,
    category,
}: RelatedItemsProps) {
    const { data, isLoading } = useGetRestaurantMenuItemsQuery(restaurantId);
    const router = useRouter();

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Spinner />
            </div>
        );
    }

    const relatedItems = data?.data
        .filter(
            (item) => item.id !== currentItemId
        )
        .slice(0, 4);

    if (!relatedItems?.length) {
        return null;
    }

    const getImageUrl = (item: MenuItem) => {
        if (!item.image) {
            return "/img/placeholder.svg";
        }
        return `${process.env.BACKEND_BASE_URL}/${item.image}`;
    };

    const handleAddToCart = (item: MenuItem) => {
        toast.success("Added to cart successfully!");
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                    <div className="relative h-48">
                        <Image
                            src={getImageUrl(item)}
                            alt={item.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <CardHeader>
                        <CardTitle className="line-clamp-1">
                            {item.name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {item.description}
                        </p>
                        <p className="mt-2 text-lg font-semibold">
                            ${item.price.toFixed(2)}
                        </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button
                            variant="outline"
                            className="bg-primary text-white hover:bg-primary/80 hover:text-white transition-colors duration-300"
                            onClick={() => router.push(`/menu/${item.id}`)}
                        >
                            View Details
                        </Button>
                        <Button
                            variant="secondary"
                            className="bg-primary text-white hover:bg-primary/80 hover:text-white transition-colors duration-300"
                            size="icon"
                            disabled={!item.is_available}
                            onClick={() => handleAddToCart(item)}
                        >
                            <ShoppingCart className="h-4 w-4" />
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
