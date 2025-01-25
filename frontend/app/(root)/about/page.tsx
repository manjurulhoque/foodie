import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChefHat, Clock, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const features = [
    {
        icon: ChefHat,
        title: "Expert Chefs",
        description:
            "Our skilled chefs bring years of culinary expertise to create exceptional dishes that delight your taste buds.",
    },
    {
        icon: Clock,
        title: "Fast Delivery",
        description:
            "We ensure your food arrives hot and fresh with our efficient delivery service.",
    },
    {
        icon: Truck,
        title: "Wide Coverage",
        description:
            "Serving multiple locations to bring delicious food right to your doorstep.",
    },
];

const AboutPage = () => {
    return (
        <Container>
            <div className="py-16 space-y-16">
                {/* Hero Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold">
                            We're Passionate About Food
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Welcome to Foodie, where culinary excellence meets
                            convenience. Our journey began with a simple
                            mission: to deliver exceptional food experiences to
                            your doorstep.
                        </p>
                        <div className="pt-4">
                            <Link href="/menu">
                                <Button>
                                    Explore Our Menu
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="relative h-[400px] rounded-lg overflow-hidden">
                        <img
                            src="https://img.freepik.com/free-vector/pizzeria-cafe-interior-with-cashier-customer_107791-28851.jpg"
                            alt="Restaurant"
                            className="object-cover"
                        />
                    </div>
                </div>

                {/* Features Section */}
                <div className="space-y-8">
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold">Why Choose Us</h2>
                        <p className="text-muted-foreground">
                            We're committed to providing the best food delivery
                            experience
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="p-6 space-y-4 bg-card rounded-lg border"
                            >
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <feature.icon className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold">
                                    {feature.title}
                                </h3>
                                <p className="text-muted-foreground">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Story Section */}
                <div className="space-y-8">
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold">Our Story</h2>
                        <p className="text-muted-foreground">
                            A journey of passion and dedication
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="relative h-[300px] rounded-lg overflow-hidden">
                            <Image
                                src="/img/chef.jpg"
                                alt="Our Chef"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="space-y-4">
                            <p className="text-muted-foreground">
                                Founded in 2020, Foodie has grown from a small
                                kitchen to a beloved food delivery service. Our
                                commitment to quality ingredients, exceptional
                                service, and customer satisfaction has made us a
                                trusted name in food delivery.
                            </p>
                            <p className="text-muted-foreground">
                                Today, we continue to innovate and expand our
                                menu while maintaining the same passion for food
                                that started our journey. Every dish is crafted
                                with care, ensuring that you get the best dining
                                experience at home.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default AboutPage;
