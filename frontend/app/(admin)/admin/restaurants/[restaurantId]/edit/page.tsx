"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
    useGetRestaurantQuery,
    useUpdateRestaurantMutation,
} from "@/store/reducers/restaurant/api";
import { toast } from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    description: z.string().min(10, {
        message: "Description must be at least 10 characters.",
    }),
    address: z.string().min(5, {
        message: "Address must be at least 5 characters.",
    }),
    phone: z.string().min(10, {
        message: "Phone must be at least 10 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    cuisine: z.string(),
});

type RestaurantFormValues = z.infer<typeof formSchema>;

export default function EditRestaurantPage({
    params,
}: {
    params: { restaurantId: string };
}) {
    const router = useRouter();
    const { data: restaurantData, isLoading: isLoadingRestaurant } =
        useGetRestaurantQuery(params.restaurantId);
    const [updateRestaurant, { isLoading: isUpdating }] =
        useUpdateRestaurantMutation();

    const form = useForm<RestaurantFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            address: "",
            phone: "",
            email: "",
            cuisine: "",
        },
    });

    useEffect(() => {
        if (restaurantData?.data) {
            form.reset(restaurantData.data);
        }
    }, [form, restaurantData]);

    async function onSubmit(data: RestaurantFormValues) {
        try {
            await updateRestaurant({
                id: params.restaurantId,
                body: data,
            }).unwrap();
            toast.success("Restaurant updated successfully");
            router.push("/admin/restaurants");
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
            console.error(error);
        }
    }

    if (isLoadingRestaurant) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={() => router.back()}
                            variant="ghost"
                            size="sm"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Edit Restaurant
                        </h2>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Update your restaurant information
                    </p>
                </div>
            </div>

            <Separator />

            <Card>
                <CardHeader>
                    <CardTitle>Restaurant Information</CardTitle>
                    <CardDescription>
                        Make changes to your restaurant details
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8 w-full"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isUpdating}
                                                    placeholder="Restaurant name"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="cuisine"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Cuisine</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isUpdating}
                                                    placeholder="Restaurant cuisine"
                                                    {...field}
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
                                                    type="email"
                                                    disabled={isUpdating}
                                                    placeholder="Restaurant email"
                                                    {...field}
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
                                                    disabled={isUpdating}
                                                    placeholder="Restaurant phone"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="md:col-span-2">
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Description
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        disabled={isUpdating}
                                                        placeholder="Restaurant description"
                                                        className="resize-none"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Address</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        disabled={isUpdating}
                                                        placeholder="Restaurant address"
                                                        className="resize-none"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-x-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="min-w-[100px]"
                                >
                                    {isUpdating ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        "Save changes"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
