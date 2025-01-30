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
    FormDescription,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
    useGetMenuItemQuery,
    useUpdateMenuItemMutation,
} from "@/store/reducers/menu/api";
import { toast } from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ArrowLeft, ImageIcon } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import { useEffect, useState } from "react";
import Spinner from "@/components/shared/spinner";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    description: z.string().min(2, {
        message: "Description must be at least 2 characters.",
    }),
    price: z.string().min(1, {
        message: "Price is required",
    }),
    category: z.string().min(1, {
        message: "Category is required",
    }),
    is_available: z.boolean().default(true),
    image: z
        .union([z.instanceof(File), z.string(), z.null(), z.undefined()])
        .optional(),
});

const categories = [
    "Appetizers",
    "Main Course",
    "Desserts",
    "Beverages",
    "Sides",
    "Specials",
];

type MenuFormValues = z.infer<typeof formSchema>;

export default function EditMenuItemPage({
    params,
}: {
    params: { restaurantId: string; menuId: string };
}) {
    const router = useRouter();
    const [updateMenuItem, { isLoading: isUpdating }] =
        useUpdateMenuItemMutation();
    const { data: menuItemData, isLoading: isLoadingMenuItem } =
        useGetMenuItemQuery(params.menuId);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const form = useForm<MenuFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            price: "",
            category: "",
            is_available: true,
        },
    });

    useEffect(() => {
        if (menuItemData?.data) {
            const { name, description, price, category, is_available, image } =
                menuItemData.data;
            form.reset({
                name,
                description,
                price: price.toString(),
                category: category.toString(),
                is_available,
            });

            if (image) {
                setImagePreview(`${process.env.BACKEND_BASE_URL}/${image}`);
            }
        }
    }, [menuItemData, form]);

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

    async function onSubmit(data: MenuFormValues) {
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("price", data.price);
            formData.append("category", data.category);
            formData.append("is_available", String(data.is_available));
            formData.append("id", params.menuId);

            if (data.image instanceof File) {
                formData.append("image", data.image);
            }

            await updateMenuItem({
                restaurantId: params.restaurantId,
                menuId: params.menuId,
                body: formData,
            }).unwrap();

            toast.success("Menu item updated successfully");
            router.push(`/admin/restaurants/${params.restaurantId}/menu`);
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
            console.error(error);
        }
    }

    if (isLoadingMenuItem) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <Card>
                <CardContent className="p-6">
                    <div className="mb-4">
                        <Button
                            variant="ghost"
                            onClick={() => router.back()}
                            className="mb-4"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Edit Menu Item
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Update your menu item details
                        </p>
                    </div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isUpdating}
                                                    placeholder="Menu item name"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    disabled={isUpdating}
                                                    placeholder="0.00"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select
                                                disabled={isUpdating}
                                                onValueChange={field.onChange}
                                                value={field.value || menuItemData?.data.category}
                                                defaultValue={field.value || ""}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {categories.map(
                                                        (category) => (
                                                            <SelectItem
                                                                key={category}
                                                                value={category}
                                                            >
                                                                {category}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="is_available"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel>
                                                    Availability
                                                </FormLabel>
                                                <FormDescription>
                                                    Make this menu item
                                                    available for ordering
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                    disabled={isUpdating}
                                                />
                                            </FormControl>
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
                                                        placeholder="Menu item description"
                                                        className="resize-none"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
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
                                            <FormMessage />
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
