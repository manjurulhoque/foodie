"use client";

import {
    useGetCartQuery,
    useRemoveFromCartMutation,
    useUpdateCartItemMutation,
    useClearCartMutation,
} from "@/store/reducers/cart/api";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import Spinner from "@/components/shared/spinner";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { MenuItem } from "@/models/restaurant.interface";

export default function CartPage() {
    const { data: cart, isLoading } = useGetCartQuery();
    const [updateCartItem] = useUpdateCartItemMutation();
    const [removeFromCart] = useRemoveFromCartMutation();
    const [clearCart] = useClearCartMutation();
    const router = useRouter();

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Spinner />
            </div>
        );
    }

    const getImageUrl = (menuItem: MenuItem) => {
        if (!menuItem.image) {
            return "/img/placeholder.svg";
        }
        return `${process.env.BACKEND_BASE_URL}/${menuItem.image}`;
    };

    if (!cart?.data?.items?.length) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">
                        Your Cart is Empty
                    </h1>
                    <p className="text-muted-foreground mb-6">
                        Looks like you haven't added anything to your cart yet.
                    </p>
                    <Button onClick={() => router.push("/")}>
                        Continue Shopping
                    </Button>
                </div>
            </div>
        );
    }

    const handleUpdateQuantity = async (itemId: number, quantity: number) => {
        try {
            await updateCartItem({ id: itemId, quantity }).unwrap();
            toast.success("Cart updated successfully");
        } catch (error) {
            toast.error("Failed to update cart");
        }
    };

    const handleRemoveItem = async (itemId: number) => {
        try {
            await removeFromCart(itemId).unwrap();
            toast.success("Item removed from cart");
        } catch (error) {
            toast.error("Failed to remove item");
        }
    };

    const handleClearCart = async () => {
        try {
            await clearCart().unwrap();
            toast.success("Cart cleared successfully");
        } catch (error) {
            toast.error("Failed to clear cart");
        }
    };

    const calculateTotal = () => {
        return cart.data.items.reduce(
            (total, item) => total + item.menu_item.price * item.quantity,
            0
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Shopping Cart</h1>
                <Button
                    variant="destructive"
                    onClick={handleClearCart}
                    disabled={!cart.data.items.length}
                >
                    Clear Cart
                </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                    {cart.data.items.map((item) => (
                        <Card key={item.id}>
                            <CardContent className="p-4">
                                <div className="flex gap-4">
                                    <div className="relative h-24 w-24 rounded-md overflow-hidden">
                                        <Image
                                            src={getImageUrl(
                                                item.menu_item
                                            )}
                                            alt={item.menu_item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold">
                                            {item.menu_item.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            ${item.menu_item.price.toFixed(2)}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() =>
                                                    handleUpdateQuantity(
                                                        item.id,
                                                        item.quantity - 1
                                                    )
                                                }
                                                disabled={item.quantity === 1}
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <span className="w-8 text-center">
                                                {item.quantity}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() =>
                                                    handleUpdateQuantity(
                                                        item.id,
                                                        item.quantity + 1
                                                    )
                                                }
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="ml-auto"
                                                onClick={() =>
                                                    handleRemoveItem(item.id)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>${calculateTotal().toFixed(2)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold">
                                    <span>Total</span>
                                    <span>${calculateTotal().toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                size="lg"
                                onClick={() => router.push("/checkout")}
                            >
                                Proceed to Checkout
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
