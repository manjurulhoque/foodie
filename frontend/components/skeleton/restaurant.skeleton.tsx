export const RestaurantSkeleton = () => {
    return (
        <div className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border rounded-lg">
            <div className="relative h-48 bg-gray-200 animate-pulse" />
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="h-6 w-32 bg-gray-200 animate-pulse rounded" />
                    <div className="h-6 w-16 bg-gray-200 animate-pulse rounded" />
                </div>
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-gray-200 animate-pulse" />
                        <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-gray-200 animate-pulse" />
                        <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
                    </div>
                </div>
            </div>
            <div className="p-6 pt-0">
                <div className="h-10 w-full bg-gray-200 animate-pulse rounded" />
            </div>
        </div>
    );
};