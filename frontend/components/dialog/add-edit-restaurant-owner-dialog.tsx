import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { useUpdateRestaurantOwnerMutation } from "@/store/reducers/restaurant/api";
import { Loader2 } from "lucide-react";
import { extractMessage } from "@/lib/utils";

const formSchema = z.object({
    email: z.string().email("Invalid owner email address"),
});

interface AddEditRestaurantOwnerDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    restaurantId: number;
    onSuccess: () => void;
}

export default function AddEditRestaurantOwnerDialog({
    open,
    setOpen,
    restaurantId,
    onSuccess,
}: AddEditRestaurantOwnerDialogProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    const [updateRestaurantOwner, { isLoading }] = useUpdateRestaurantOwnerMutation();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await updateRestaurantOwner({ id: restaurantId, email: values.email });
            if (response.error) {
                toast.error(extractMessage(response.error));
            } else {
                toast.success("Restaurant owner updated successfully");
                onSuccess();
                setOpen(false);
            }
        } catch (error) {
            toast.error("Error updating restaurant owner");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogDescription>
                Add an owner to the restaurant. The owner will be able to manage the restaurant and its employees.
            </DialogDescription>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Owner</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>User Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">
                            Add Owner
                            {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                </Button>
            </DialogFooter>
        </Dialog>
    );
}
