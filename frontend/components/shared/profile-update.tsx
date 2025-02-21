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
import { toast } from "react-hot-toast";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useMeQuery, useUpdateUserMutation } from "@/store/reducers/user/api";
import { useEffect } from "react";
import Spinner from "@/components/shared/spinner";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    phone: z.string({
        message: "Phone number is required",
    }),
});

type AccountFormValues = z.infer<typeof formSchema>;

export default function ProfileUpdate() {
    const router = useRouter();
    const { data: user, isLoading, refetch } = useMeQuery(null);
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
    const form = useForm<AccountFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
        },
    });

    useEffect(() => {
        if (user?.data) {
            form.reset({
                name: user.data.name,
                email: user.data.email,
                phone: user.data.phone || "",
            });
        }
    }, [user?.data, form]);

    async function onSubmit(data: AccountFormValues) {
        try {
            const response = await updateUser({
                name: data.name,
                email: data.email,
                phone: data.phone,
            });
            if (response.data) {
                toast.success("Account updated successfully");
                refetch();
            }
            if (response.error) {
                toast.error("Something went wrong while updating your account");
                console.error(response.error);
            }
        } catch (error) {
            toast.error("Something went wrong");
            console.error(error);
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>
                        Update your account details and preferences
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            <div className="grid gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter your name"
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
                                                    placeholder="Enter your email"
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
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="tel"
                                                    placeholder="Enter your phone number"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex items-center gap-x-2">
                                <Button
                                    type="submit"
                                    disabled={form.formState.isSubmitting}
                                >
                                    {form.formState.isSubmitting ? (
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
