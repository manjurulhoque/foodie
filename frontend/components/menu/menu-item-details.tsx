"use client";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Heart, HeartCrack, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { MenuItem } from "@/models/restaurant.interface";
import toast from "react-hot-toast";
import { useAddToCartMutation } from "@/store/reducers/cart/api";

interface MenuItemProps {
    menuItem: MenuItem;
}

export const MenuItemDetails = ({ menuItem }: MenuItemProps) => {
    const [isLiked, setIsLiked] = useState(false);
    const IsLikedIcon = isLiked ? Heart : HeartCrack;
    const [addToCart] = useAddToCartMutation();
    
    const getImageUrl = () => {
        if (!menuItem.image) {
            return fetch(`https://foodish-api.com/api/`)
                .then((response) => response.json())
                .then((data) => data.image)
                .catch((error) => {
                    console.error("Error fetching image:", error);
                    return null;
                });
        }
        return Promise.resolve(
            `${process.env.BACKEND_BASE_URL}/${menuItem.image}`
        );
    };

    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        getImageUrl().then((url) => setImageUrl(url));
    }, [menuItem.image]);

    const handleAddToCart = () => {
        addToCart({
            menu_item_id: menuItem.id,
            quantity: 1,
        })
            .unwrap()
            .then(() => {
                toast.success("Added to cart successfully!");
            })
            .catch((error) => {
                toast.error("Failed to add to cart");
            });
    };

    return (
        <Card className="w-full max-h-[340px] rounded-md bg-white shadow-lg border-none flex flex-col items-center justify-center relative py-6 pt-24 md:pt-28">
            <div className="absolute -top-[4%] md:-top-[20%] overflow-hidden w-24 md:w-40 h-24 md:h-40 rounded-full bg-emerald-500 flex items-center justify-center p-1 md:p-2">
                <div className="w-full h-full rounded-full bg-white relative">
                    <Image
                        src={imageUrl || ""}
                        width={100}
                        height={100}
                        className="w-full h-full object-contain rounded-full"
                        alt={menuItem.name}
                    />
                </div>
            </div>

            <Link
                href={`/menu/${menuItem.id}`}
                className="w-full px-2 text-center"
            >
                <CardTitle className="text-neutral-700 truncate w-full text-lg">
                    {menuItem.name}
                </CardTitle>
            </Link>

            <div className="w-full flex items-center justify-center gap-2 flex-wrap mt-4 px-2">
                {/* {menuItem.cuisine && (
                    <div className="rounded-md bg-emerald-500/10 px-2 py-[2px] text-[11px] font-semibold capitalize">
                        {menuItem.cuisine}
                    </div>
                )} */}

                {menuItem.category && (
                    <div className="rounded-md bg-blue-500/10 px-2 py-[2px] text-[11px] font-semibold capitalize">
                        {menuItem.category}
                    </div>
                )}

                {/* {menuItem.kitchen && (
                    <div className="rounded-md bg-red-500/10 px-2 py-[2px] text-[11px] font-semibold  capitalize">
                        {menuItem.kitchen}
                    </div>
                )}

                {menuItem.size && (
                    <div className="rounded-md bg-yellow-500/10 px-2 py-[2px] text-[11px] font-semibold capitalize">
                        {menuItem.size}
                    </div>
                )} */}
            </div>

            <CardDescription className="text-center px-2 my-2">
                {menuItem.description}
            </CardDescription>

            <div className="w-full flex items-center px-2 mt-4 gap-3">
                <Button
                    variant="outline"
                    className="rounded-full font-bold text-lg text-muted-foreground"
                >
                    ${menuItem.price}
                </Button>
                <Link href={`/menu/${menuItem.id}`} className="w-full">
                    <Button className="bg-emerald-500 w-full rounded-full hover:bg-emerald-600">
                        Buy Now
                    </Button>
                </Link>
            </div>

            {/* add to cart */}
            <Button
                className="absolute top-0 right-0 rounded-tl-none rounded-br-none bg-black text-white hover:bg-black"
                size="sm"
                onClick={() => handleAddToCart()}
            >
                <ShoppingCart className="w-4 h-4" />
            </Button>

            {/* add to whitelist */}
            <Button
                className="absolute top-0 left-0 rounded-tr-none rounded-bl-none"
                size="sm"
                onClick={() => {}}
                variant="outline"
            >
                <IsLikedIcon
                    className={cn(
                        "w-5 h-5",
                        isLiked ? "text-red-500" : "text-black"
                    )}
                />
            </Button>
        </Card>
    );
};
