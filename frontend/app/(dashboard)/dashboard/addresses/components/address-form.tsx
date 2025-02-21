"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Address } from "@/models/address.interface";
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
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-hot-toast";

const formSchema = z.object({
    label: z.string().min(1, "Label is required"),
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postal_code: z.string().min(1, "Postal code is required"),
    is_default: z.boolean().default(false),
});

type AddressFormValues = z.infer<typeof formSchema>;

interface AddressFormProps {
    initialData?: Address;
    onSubmit: (data: AddressFormValues) => Promise<void>;
    isLoading: boolean;
}

export function AddressForm({
    initialData,
    onSubmit,
    isLoading,
}: AddressFormProps) {
    const router = useRouter();

    const form = useForm<AddressFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: "",
            street: "",
            city: "",
            state: "",
            postal_code: "",
            is_default: false,
        },
    });

    const handleSubmit = async (data: AddressFormValues) => {
        try {
            await onSubmit(data);
            router.push("/dashboard/addresses");
            toast.success(initialData ? "Address updated" : "Address created");
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-8"
            >
                <FormField
                    control={form.control}
                    name="label"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Label</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Home, Work, etc."
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Street</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Street address"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                                <Input placeholder="City" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                                <Input placeholder="State" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="postal_code"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Postal Code</FormLabel>
                            <FormControl>
                                <Input placeholder="Postal code" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="is_default"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Set as default address</FormLabel>
                            </div>
                        </FormItem>
                    )}
                />
                <div className="flex items-center gap-x-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/dashboard/addresses")}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {initialData ? "Update" : "Create"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
