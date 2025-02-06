import { WorkingHour, Restaurant } from "@/models/restaurant.interface";
import { format } from "date-fns";
import { DaysOfWeek } from "@/lib/days";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

function formatTime(time: string) {
    return format(new Date(`2000-01-01T${time}`), "h:mm a");
}

function WorkingHoursDisplay({
    workingHours,
}: {
    workingHours: WorkingHour[];
}) {
    const sortedHours = [...workingHours].sort(
        (a, b) => a.day_of_week - b.day_of_week
    );

    return (
        <div className="space-y-2">
            {sortedHours.map((hour) => (
                <div
                    key={hour.day_of_week}
                    className="flex justify-between text-sm"
                >
                    <span className="font-medium">
                        {DaysOfWeek[hour.day_of_week]}
                    </span>
                    <span className="text-muted-foreground">
                        {hour.is_closed
                            ? "Closed"
                            : `${formatTime(hour.open_time)} - ${formatTime(
                                  hour.close_time
                              )}`}
                    </span>
                </div>
            ))}
        </div>
    );
}

export default function RestaurantInfoDialog({
    restaurant,
    workingHours,
}: {
    restaurant: Restaurant;
    workingHours: WorkingHour[];
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                    <Info className="mr-2 h-4 w-4" />
                    More Info
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{restaurant.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <h4 className="text-sm font-semibold mb-2">Address</h4>
                        <p className="text-sm text-muted-foreground">
                            {restaurant.address}
                        </p>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold mb-2">
                            Delivery Fee
                        </h4>
                        <p className="text-sm text-muted-foreground">
                            Delivery fee is charged based on time of day and
                            distance.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold mb-2">
                            Minimum Order
                        </h4>
                        <p className="text-sm text-muted-foreground">
                            For orders below Tk 100.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold mb-2">
                            Opening Hours
                        </h4>
                        <div className="bg-muted rounded-lg p-3">
                            <WorkingHoursDisplay workingHours={workingHours} />
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
