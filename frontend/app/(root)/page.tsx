"use client";

import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import {
    Truck,
    MapPin,
    Smartphone,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useGetPopularCuisinesQuery } from "@/store/reducers/cuisine/api";
import { Cuisine } from "@/models/cuisine.interface";

export default function Home() {
    const { data: popularCuisines, isLoading } = useGetPopularCuisinesQuery();
    const features = [
        {
            icon: <Truck className="h-12 w-12 text-primary" />,
            title: "Super fast Delivery",
            description:
                "Faster than your cravings can blink. Experience the super-fast delivery and get fresh food.",
        },
        {
            icon: <MapPin className="h-12 w-12 text-primary" />,
            title: "Live Order Tracking",
            description:
                "Track your order while it is delivered to your doorstep from the restaurant.",
        },
        {
            icon: <Smartphone className="h-12 w-12 text-primary" />,
            title: "Your Favorite Restaurants",
            description:
                "Find the best and nearest top your favorite restaurants from your selected location.",
        },
    ];

    const getCuisineImage = (cuisine: Cuisine) => {
        if (cuisine.image) {
            return `${process.env.BACKEND_BASE_URL}/${cuisine.image}`;
        }
        return `/img/default-menu.svg`;
    };

    return (
        <>
            <Container className="px-4 md:px-12">
                <section className="grid grid-cols-1 md:grid-cols-2 py-12 pt-16">
                    <div className="flex flex-col items-start justify-start gap-3">
                        <p className="px-6 py-1 rounded-full text-neutral-500 border border-gray-300">
                            Craving Something Delicious?
                        </p>
                        <h2 className="text-5xl font-bold tracking-wider uppercase text-neutral-700 my-4 ">
                            Welcome To{" "}
                            <span className="block py-4">Foodie Paradise</span>
                        </h2>

                        <p className="text-base text-neutral-500 text-center md:text-left my-4">
                            Looking for amazing food? Browse through our curated
                            selection of delicious dishes from the best
                            restaurants near you, all available at your
                            fingertips!
                        </p>

                        <div className="my-4 text-center flex justify-center gap-6 w-full md:w-auto">
                            <Link href="/restaurants">
                                <Button className="px-8 md:px-16 py-4 md:py-6 rounded-full bg-primary text-white hover:bg-primary/90">
                                    Order Now
                                </Button>
                            </Link>
                            <Link href="/menu">
                                <Button
                                    variant="outline"
                                    className="px-8 md:px-16 py-4 md:py-6 rounded-full hover:bg-primary/10"
                                >
                                    Explore Menu
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="w-full relative h-[560px] flex items-center justify-center">
                        <Image
                            src="/img/plate.png"
                            alt="hero-img"
                            className="object-contain w-full h-full absolute"
                            fill
                            priority
                        />
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">
                            Why Choose Us?
                        </h2>
                        <p className="text-neutral-500 max-w-2xl mx-auto">
                            Experience exceptional service, fresh ingredients,
                            and mouthwatering dishes crafted by our expert
                            chefs. We pride ourselves on quality, convenience,
                            and bringing delicious meals right to your doorstep.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="text-center p-6 rounded-lg transition-all duration-300 shadow-lg"
                            >
                                <div className="flex justify-center mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-neutral-500">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Favourite Cuisines Section */}
                <section className="py-20">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">
                            Favourite Cuisines
                        </h2>
                    </div>
                    <div className="relative">
                        <div
                            className="flex items-center justify-between gap-6 overflow-x-auto pb-4 scrollbar-hide"
                        >
                            {popularCuisines?.data?.map((cuisine, index) => (
                                <Link
                                    href={`/cuisines/${cuisine.id}`}
                                    key={cuisine.id}
                                    className="flex-shrink-0"
                                >
                                    <div className="w-40 flex flex-col items-center gap-4 p-4 rounded-lg bg-white hover:shadow-md transition-all duration-300">
                                        <div className="relative w-24 h-24 rounded-full overflow-hidden">
                                            <Image
                                                src={getCuisineImage(cuisine)}
                                                alt={cuisine.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <span className="font-medium text-neutral-700">
                                            {cuisine.name}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <button
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    </div>
                </section>

                {/* Popular Section  */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 gap-y-20 my-4 py-12">
                    {/* Add popular items here */}
                </section>

                {/* Chefs Section  */}
                <section className="py-20">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">
                            Our Special Chefs
                        </h2>
                        <p className="text-neutral-500 max-w-2xl mx-auto">
                            Meet our talented culinary artists who bring passion
                            and expertise to every dish. Our chefs combine years
                            of experience with creative innovation to craft
                            unforgettable dining experiences.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Add chef cards here */}
                    </div>
                </section>
            </Container>
        </>
    );
}
