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
import { useCreateRestaurantMutation } from "@/store/reducers/restaurant/api";
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
import { useState } from "react";
import Image from "next/image";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useGetCuisinesQuery } from "@/store/reducers/cuisine/api";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    description: z.string().min(2, {
        message: "Description must be at least 2 characters.",
    }),
    address: z.string().min(2, {
        message: "Address must be at least 2 characters.",
    }),
    phone: z.string().min(2, {
        message: "Phone must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    cuisine_id: z.union([z.string(), z.number()]).transform((value) => {
        if (typeof value === "string") {
            const parsed = parseInt(value);
            if (isNaN(parsed)) {
                throw new Error("Invalid cuisine ID");
            }
            return parsed;
        }
        return value;
    }),
    image: z
        .any()
        .refine((file) => !file || file instanceof File, "Must be a file")
        .optional(),
});

type RestaurantFormValues = z.infer<typeof formSchema>;

export default function NewRestaurantPage() {
    const router = useRouter();
    const { data: cuisineData, isLoading: isLoadingCuisine } = useGetCuisinesQuery();
    const [createRestaurant, { isLoading }] = useCreateRestaurantMutation();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const form = useForm<RestaurantFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            address: "",
            phone: "",
            email: "",
            cuisine_id: "",
        },
    });

    async function onSubmit(data: RestaurantFormValues) {
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("address", data.address);
            formData.append("phone", data.phone);
            formData.append("email", data.email);
            formData.append("cuisine_id", data.cuisine_id.toString());
            if (data.image instanceof File) {
                formData.append("image", data.image);
            }

            await createRestaurant(formData).unwrap();

            toast.success("Restaurant created successfully");
            router.push("/admin/restaurants");
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
                        Enter the details of your restaurant
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
                                                    disabled={isLoading}
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
                                    name="cuisine_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Cuisine</FormLabel>
                                            {isLoadingCuisine ? (
                                                <div className="flex h-10 w-full items-center justify-center rounded-md border">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                </div>
                                            ) : (
                                                <Select
                                                    onValueChange={(value) => field.onChange(Number(value))}
                                                    value={field.value?.toString() || ""}
                                                defaultValue={field.value?.toString() || ""}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a cuisine" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {cuisineData?.data?.map(
                                                        (cuisine) => (
                                                            <SelectItem
                                                                key={cuisine.id}
                                                                value={cuisine.id.toString()}
                                                            >
                                                                {cuisine.name}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                    </SelectContent>
                                                </Select>
                                            )}
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
                                                    disabled={isLoading}
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
                                                    disabled={isLoading}
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
                                                    disabled={isLoading}
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
                                                    disabled={isLoading}
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
                                        field: {
                                            value,
                                            onChange,
                                            ...field
                                        },
                                    }) => (
                                        <FormItem>
                                            <FormLabel>Image</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    disabled={isLoading}
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
                                    disabled={isLoading}
                                    className="min-w-[100px]"
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        "Create"
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
