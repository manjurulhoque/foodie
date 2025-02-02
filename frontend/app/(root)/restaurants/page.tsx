"use client";

import { useGetRestaurantsQuery } from "@/store/reducers/restaurant/api";
import { useGetCuisinesQuery } from "@/store/reducers/cuisine/api";
import { Restaurant } from "@/models/restaurant.interface";
import { useState } from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin, Search, Star, UtensilsCrossed } from "lucide-react";
import Spinner from "@/components/shared/spinner";

export default function RestaurantsPage() {
    const { data, isLoading } = useGetRestaurantsQuery();
    const { data: cuisines } = useGetCuisinesQuery();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCuisine, setSelectedCuisine] = useState<number | null>(null);
    const [ratingFilter, setRatingFilter] = useState([0]);
    const router = useRouter();

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Spinner />
            </div>
        );
    }

    const filteredRestaurants = data?.data.filter((restaurant: Restaurant) => {
        const matchesSearch = restaurant.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesCuisine =
            !selectedCuisine || restaurant.cuisine_id === selectedCuisine;
        const matchesRating = restaurant.rating >= ratingFilter[0];
        return matchesSearch && matchesCuisine && matchesRating;
    });

    const getImageUrl = (restaurant: Restaurant) => {
        if (!restaurant.image) {
            return "/img/placeholder.svg";
        }
        return `${process.env.BACKEND_BASE_URL}/${restaurant.image}`;
    };

    return (
        <div className="container mx-auto py-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                {/* Filters Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Filters</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Search */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Search
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search restaurants..."
                                        className="pl-8"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            {/* Cuisines */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Cuisines
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    <Badge
                                        className={`cursor-pointer ${
                                            selectedCuisine === null
                                                ? "bg-primary text-white"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                        onClick={() => setSelectedCuisine(null)}
                                    >
                                        All
                                    </Badge>
                                    {cuisines?.data.map((cuisine) => (
                                        <Badge
                                            key={cuisine.id}
                                            className={`cursor-pointer ${
                                                selectedCuisine === cuisine.id
                                                    ? "bg-primary text-white"
                                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                            }`}
                                            onClick={() =>
                                                setSelectedCuisine(cuisine.id)
                                            }
                                        >
                                            {cuisine.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Rating Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Minimum Rating: {ratingFilter[0]}
                                </label>
                                <Slider
                                    value={ratingFilter}
                                    onValueChange={setRatingFilter}
                                    max={5}
                                    step={0.5}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Restaurant Grid */}
                <div className="md:col-span-3">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredRestaurants?.map((restaurant) => (
                            <Card
                                key={restaurant.id}
                                className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="relative h-48">
                                    <Image
                                        src={getImageUrl(restaurant)}
                                        alt={restaurant.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span className="line-clamp-1">
                                            {restaurant.name}
                                        </span>
                                        <Badge className="flex items-center gap-1">
                                            <Star className="h-3 w-3" />
                                            {restaurant.rating}
                                        </Badge>
                                    </CardTitle>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <UtensilsCrossed className="h-4 w-4" />
                                        {restaurant.cuisine?.name}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4" />
                                        {restaurant.address}
                                    </div>
                                </CardHeader>
                                <CardFooter>
                                    <Button
                                        className="w-full"
                                        onClick={() =>
                                            router.push(
                                                `/restaurants/${restaurant.id}`
                                            )
                                        }
                                    >
                                        View Menu
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
