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
import { Loader2, ArrowLeft, ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useGetCuisinesQuery } from "@/store/reducers/cuisine/api";
import Select from "react-select";
import Spinner from "@/components/shared/spinner";


const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    description: z.string().min(2, {
        message: "Description must be at least 2 characters.",
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
    cuisine_ids: z.array(z.number()).min(1, "Select at least one cuisine"),
    image: z
        .union([
            typeof window !== "undefined" && globalThis.File
                ? z.instanceof(globalThis.File)
                : z.never(), // Prevents SSR crash
            z.string(),
            z.null(),
            z.undefined(),
        ])
        .optional(),
});

type RestaurantFormValues = z.infer<typeof formSchema>;

export default function EditRestaurantPage({
    params,
}: {
    params: { restaurantId: string };
}) {
    const router = useRouter();
    const { data: restaurantData, isLoading: isLoadingRestaurant } = useGetRestaurantQuery(params.restaurantId);
    const [updateRestaurant, { isLoading: isUpdating }] = useUpdateRestaurantMutation();
    const { data: cuisineData, isLoading: isLoadingCuisine } = useGetCuisinesQuery();
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (restaurantData?.data?.image) {
            setImagePreview(
                `${process.env.BACKEND_BASE_URL}/${restaurantData.data.image}`
            );
        }
    }, [restaurantData]);

    const form = useForm<RestaurantFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            address: "",
            phone: "",
            email: "",
            cuisine_ids: [],
        },
    });

    useEffect(() => {
        if (restaurantData?.data) {
            form.reset(restaurantData.data);
            form.setValue("cuisine_ids", restaurantData.data.cuisines.map((cuisine) => cuisine.id));
        }
    }, [form, restaurantData]);

    async function onSubmit(data: RestaurantFormValues) {
        try {
            const formData = new FormData();
            formData.append("id", params.restaurantId);
            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("address", data.address);
            formData.append("phone", data.phone);
            formData.append("email", data.email);
            formData.append("cuisine_ids", JSON.stringify(data.cuisine_ids));
            if (data.image && data.image instanceof File) {
                formData.append("image", data.image);
            }

            await updateRestaurant({
                id: params.restaurantId,
                body: formData,
            }).unwrap();

            toast.success("Restaurant updated successfully");
            router.push("/owner/restaurants");
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
            console.error(error);
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setValue("image", file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    if (isLoadingRestaurant) {
        return (
            <div className="flex items-center justify-center h-full">
                <Spinner />
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
                            variant="outline"
                            size="sm"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Button>
                    </div>
                </div>
            </div>

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
                                    name="cuisine_ids"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Cuisines</FormLabel>
                                            <Select
                                                isMulti
                                                isLoading={isLoadingCuisine}
                                                options={cuisineData?.data?.map((cuisine) => ({
                                                    value: cuisine.id,
                                                    label: cuisine.name,
                                                })) ?? []}
                                                value={(cuisineData?.data ?? [])
                                                    .filter((cuisine) => field.value.includes(cuisine.id))
                                                    .map((cuisine) => ({
                                                        value: cuisine.id,
                                                        label: cuisine.name,
                                                    }))}
                                                onChange={(newValue) => {
                                                    const selectedValues = newValue ? 
                                                        (newValue as { value: number; label: string }[]).map(item => item.value) 
                                                        : [];
                                                    field.onChange(selectedValues);
                                                }}
                                            />
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
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
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
                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({
                                        field: { value, onChange, ...field },
                                    }) => (
                                        <FormItem>
                                            <FormLabel>Image</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    disabled={isUpdating}
                                                    onChange={handleImageChange}
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <div>
                                    <FormLabel>Image Preview</FormLabel>
                                    {imagePreview ? (
                                        <div className="relative h-40 w-40 overflow-hidden rounded-lg border">
                                            <Image
                                                src={imagePreview}
                                                alt="Preview"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex h-40 w-40 items-center justify-center rounded-lg border">
                                            <ImageIcon className="h-10 w-10 text-muted-foreground" />
                                        </div>
                                    )}
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
