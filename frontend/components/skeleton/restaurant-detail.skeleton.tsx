import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function RestaurantDetailSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Skeleton className="h-[300px] w-full" />
            <div className="container mx-auto -mt-10 px-4">
                <Card className="relative">
                    <div className="flex">
                        <div className="w-64 border-r p-4">
                            <Skeleton className="h-6 w-32 mb-4" />
                            <div className="space-y-2">
                                {[...Array(8)].map((_, i) => (
                                    <Skeleton key={i} className="h-10 w-full" />
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 p-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {[...Array(6)].map((_, i) => (
                                    <Skeleton key={i} className="h-32 w-full" />
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
