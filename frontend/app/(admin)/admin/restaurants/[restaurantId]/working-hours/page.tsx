"use client";

import { useEffect } from "react";
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
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import {
    useGetRestaurantQuery,
    useUpdateWorkingHoursMutation,
} from "@/store/reducers/restaurant/api";
import { toast } from "react-hot-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

const workingHoursSchema = z.object({
    workingHours: z.array(
        z.object({
            dayOfWeek: z.number(),
            openTime: z.string(),
            closeTime: z.string(),
            isClosed: z.boolean(),
        })
    ),
});

type WorkingHoursFormValues = z.infer<typeof workingHoursSchema>;

export default function WorkingHoursPage({
    params,
}: {
    params: { restaurantId: string };
}) {
    const router = useRouter();
    const { data: restaurant, isLoading } = useGetRestaurantQuery(
        params.restaurantId
    );
    const [updateWorkingHours, { isLoading: isUpdating }] =
        useUpdateWorkingHoursMutation();

    const form = useForm<WorkingHoursFormValues>({
        resolver: zodResolver(workingHoursSchema),
        defaultValues: {
            workingHours: daysOfWeek.map((_, index) => ({
                dayOfWeek: index,
                openTime: "09:00",
                closeTime: "17:00",
                isClosed: false,
            })),
        },
    });

    // Set form values when restaurant data is loaded
    useEffect(() => {
        if (restaurant?.data?.working_hours?.length) {
            const sortedHours = [...restaurant.data.working_hours].sort(
                (a, b) => a.day_of_week - b.day_of_week
            );
            form.reset({
                workingHours: sortedHours.map((hour) => ({
                    dayOfWeek: hour.day_of_week,
                    openTime: hour.open_time,
                    closeTime: hour.close_time,
                    isClosed: hour.is_closed,
                })),
            });
        }
    }, [restaurant, form]);

    const onSubmit = async (values: WorkingHoursFormValues) => {
        try {
            await updateWorkingHours({
                id: parseInt(params.restaurantId),
                workingHours: values.workingHours.map((wh) => ({
                    day_of_week: wh.dayOfWeek,
                    open_time: wh.openTime,
                    close_time: wh.closeTime,
                    is_closed: wh.isClosed,
                })),
            }).unwrap();
            toast.success("Working hours updated successfully");
            router.back();
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">
                    Working Hours
                </h2>
                <Button variant="outline" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Set Working Hours</CardTitle>
                    <CardDescription>
                        Configure the operating hours for{" "}
                        {restaurant?.data?.name}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="space-y-4">
                                {daysOfWeek.map((day, index) => (
                                    <div key={day}>
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-medium">
                                                {day}
                                            </h3>
                                            <FormField
                                                control={form.control}
                                                name={`workingHours.${index}.isClosed`}
                                                render={({ field }) => (
                                                    <FormItem className="flex items-center space-x-2">
                                                        <FormLabel>
                                                            Closed
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Switch
                                                                checked={
                                                                    field.value
                                                                }
                                                                onCheckedChange={
                                                                    field.onChange
                                                                }
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="flex gap-4">
                                            <FormField
                                                control={form.control}
                                                name={`workingHours.${index}.openTime`}
                                                render={({ field }) => (
                                                    <FormItem className="flex-1">
                                                        <FormLabel>
                                                            Opening Time
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="time"
                                                                disabled={form.watch(
                                                                    `workingHours.${index}.isClosed`
                                                                )}
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`workingHours.${index}.closeTime`}
                                                render={({ field }) => (
                                                    <FormItem className="flex-1">
                                                        <FormLabel>
                                                            Closing Time
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="time"
                                                                disabled={form.watch(
                                                                    `workingHours.${index}.isClosed`
                                                                )}
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        {index < daysOfWeek.length - 1 && (
                                            <Separator className="my-4" />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center mt-6 gap-x-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isUpdating}>
                                    {isUpdating ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        "Save Changes"
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
