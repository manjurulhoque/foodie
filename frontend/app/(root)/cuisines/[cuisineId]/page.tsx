"use client";

import { Container } from "@/components/shared/container";
import { useGetRestaurantsByCuisineQuery } from "@/store/reducers/restaurant/api";
import { useGetCuisineQuery } from "@/store/reducers/cuisine/api";
import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RestaurantSkeleton } from "@/components/skeleton/restaurant.skeleton";
import { EmptyState } from "@/components/shared/empty-state";

export default function CuisinePage({
    params,
}: {
    params: { cuisineId: string };
}) {
    const { data: cuisine, isLoading: isCuisineLoading } = useGetCuisineQuery(
        params.cuisineId
    );
    const { data: restaurants, isLoading: isRestaurantsLoading } =
        useGetRestaurantsByCuisineQuery(params.cuisineId);

    if (isRestaurantsLoading || isCuisineLoading) {
        return <RestaurantSkeleton />;
    }

    return (
        <>
            <div className="w-full h-[400px] relative">
                <Image
                    src="/img/cuisine-banner.jpg"
                    alt="Cuisine Banner"
                    fill
                    className="object-cover opacity-100"
                />
                <div className="absolute inset-0 bg-black/40" />
                <Container className="relative h-full flex items-center">
                    <h1 className="text-4xl font-bold text-white">
                        {cuisine?.data?.name}
                    </h1>
                </Container>
            </div>

            <Container className="py-8">
                {!restaurants?.data?.length ? (
                    <EmptyState 
                        title="No restaurants found"
                        description="There are no restaurants available for this cuisine yet."
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {restaurants.data.map((restaurant) => (
                            <Link
                                href={`/restaurants/${restaurant.id}`}
                                key={restaurant.id}
                                className="block group"
                            >
                                <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-shadow">
                                    <div className="relative h-48">
                                        <Image
                                            src={
                                                restaurant.image
                                                    ? `${process.env.BACKEND_BASE_URL}/${restaurant.image}`
                                                    : "/img/placeholder.svg"
                                            }
                                            alt={restaurant.name}
                                            fill
                                            className="object-cover"
                                        />
                                        {!restaurant.is_open && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <span className="text-white font-medium">
                                                    Temporarily unavailable
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                                {restaurant.name}
                                            </h3>
                                            <Badge
                                                variant={
                                                    restaurant.is_open
                                                        ? "default"
                                                        : "destructive"
                                                }
                                            >
                                                {restaurant.is_open
                                                    ? "Open"
                                                    : "Closed"}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            {restaurant.description}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                <span>
                                                    30 min
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span>⭐ {restaurant.rating}</span>
                                                <span>({20})</span>
                                            </div>
                                        </div>
                                        {!restaurant.is_open && (
                                            <div className="mt-3">
                                                <p className="text-sm text-primary">
                                                    Opens at 10:00 AM
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </Container>
        </>
    );
}
