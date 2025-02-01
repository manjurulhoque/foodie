"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useGetCartQuery } from "@/store/reducers/cart/api";
import { useCreateOrderMutation } from "@/store/reducers/order/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Spinner from "@/components/shared/spinner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useMeQuery } from "@/store/reducers/user/api";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Name is required.",
    }),
    email: z.string().email({
        message: "Invalid email address.",
    }),
    phone: z.string().min(10, {
        message: "Phone number must be at least 10 digits.",
    }),
    delivery_address: z.string().min(10, {
        message: "Delivery address must be at least 10 characters.",
    }),
    payment_method: z.string().min(1, {
        message: "Payment method is required.",
    }),
});

export default function CheckoutPage() {
    const { data: user, isLoading: isUserLoading } = useMeQuery(null);
    const { data: cart, isLoading: isCartLoading } = useGetCartQuery();
    const [createOrder, { isLoading: isCreatingOrder }] =
        useCreateOrderMutation();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: user?.data?.name || "",
            email: user?.data?.email || "",
            phone: user?.data?.phone || "",
            delivery_address: "",
            payment_method: "cash",
        },
    });

    useEffect(() => {
        if (user?.data) {
            form.setValue("name", user.data.name);
            form.setValue("email", user.data.email);
            form.setValue("phone", user.data.phone);
        }
    }, [user?.data]);

    if (isCartLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (!cart?.data?.items?.length) {
        router.push("/cart");
        return null;
    }

    const calculateTotal = () => {
        return cart.data.items.reduce(
            (total, item) => total + item.menu_item.price * item.quantity,
            0
        );
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await createOrder(values).unwrap();
            toast.success("Order placed successfully!");
            router.push("/orders");
        } catch (error) {
            toast.error("Failed to place order");
        }
    };

    return (
        <div className="container mx-auto px-4 py-40">
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Delivery Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-8"
                                >
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        readOnly
                                                        disabled
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        readOnly
                                                        disabled
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Enter your phone number"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="delivery_address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Delivery Address
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Enter your delivery address"
                                                        className="resize-none"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="payment_method"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Payment Method
                                                </FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        defaultValue={
                                                            field.value
                                                        }
                                                    >
                                                        <FormItem>
                                                            <FormControl>
                                                                <RadioGroupItem value="cash" id="cash"/>
                                                            </FormControl>
                                                            <Label htmlFor="cash">{" "}Cash</Label>
                                                        </FormItem>
                                                    </RadioGroup>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>

                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {cart.data.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between text-sm"
                                    >
                                        <span>
                                            {item.quantity}x{" "}
                                            {item.menu_item.name}
                                        </span>
                                        <span>
                                            $
                                            {(
                                                item.menu_item.price *
                                                item.quantity
                                            ).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                                <Separator />
                                <div className="flex justify-between font-bold">
                                    <span>Total</span>
                                    <span>${calculateTotal().toFixed(2)}</span>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isCreatingOrder}
                                >
                                    {isCreatingOrder ? (
                                        <Spinner className="h-4 w-4" />
                                    ) : (
                                        "Place Order"
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
