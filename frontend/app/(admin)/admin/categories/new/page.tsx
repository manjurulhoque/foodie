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
import { useCreateCategoryMutation } from "@/store/reducers/category/api";
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
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    description: z.string().min(2, {
        message: "Description must be at least 2 characters.",
    }),
    is_active: z.boolean().default(true),
});

type CategoryFormValues = z.infer<typeof formSchema>;

export default function NewCategoryPage() {
    const router = useRouter();
    const [createCategory, { isLoading }] = useCreateCategoryMutation();

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            is_active: true,
        },
    });

    async function onSubmit(data: CategoryFormValues) {
        try {
            await createCategory(data).unwrap();
            toast.success("Category created successfully");
            router.push("/admin/categories");
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
            console.error(error);
        }
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <Button
                variant="outline"
                onClick={() => router.back()}
                className="pl-0 mb-4"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>
            <Card>
                <CardHeader>
                    <CardTitle>Category Information</CardTitle>
                    <CardDescription>
                        Enter the details of your category
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isLoading}
                                                    placeholder="Category name"
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
                                                    placeholder="Category description"
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
                                    name="is_active"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">
                                                    Active
                                                </FormLabel>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                    disabled={isLoading}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
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
