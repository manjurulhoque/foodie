"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSession } from "next-auth/react";
import { Order } from "@/models/order.interface";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { useUpdateOrderStatusMutation } from "@/store/reducers/owner/api";

const formSchema = z.object({
    status: z.enum(["pending", "preparing", "ready", "delivered", "cancelled"]),
    payment_status: z.enum(["pending", "paid", "failed"]),
});

interface UpdateOrderStatusDialogProps {
    order: Order;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export default function UpdateOrderStatusDialog({
    order,
    open,
    onOpenChange,
    onSuccess,
}: UpdateOrderStatusDialogProps) {
    const [updateOrderStatus, { isLoading }] = useUpdateOrderStatusMutation();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            status: order.status,
            payment_status: order.payment_status,
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await updateOrderStatus({ id: order.id, status: values.status, payment_status: values.payment_status });
            if (response.data?.success) {
                toast.success("Order status updated successfully");
                onSuccess();
            } else {
                toast.error("Error updating order status");
            }
        } catch (error) {
            toast.error("Error updating order status");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Order Status</DialogTitle>
                    <DialogDescription>
                        Update the status of the order
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select order status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="pending">
                                                Pending
                                            </SelectItem>
                                            <SelectItem value="preparing">
                                                Preparing
                                            </SelectItem>
                                            <SelectItem value="ready">
                                                Ready
                                            </SelectItem>
                                            <SelectItem value="delivered">
                                                Delivered
                                            </SelectItem>
                                            <SelectItem value="cancelled">
                                                Cancelled
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="payment_status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Payment Status</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select payment status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="pending">
                                                Pending
                                            </SelectItem>
                                            <SelectItem value="paid">
                                                Paid
                                            </SelectItem>
                                            <SelectItem value="failed">
                                                Failed
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">
                            Update Status
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
