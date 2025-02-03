import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
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
                            selection of delicious dishes from the best restaurants
                            near you, all available at your fingertips!
                        </p>

                        <div className="my-4 text-center flex justify-center gap-6 w-full md:w-auto">
                            <Link href="/menu">
                                <Button className="px-8 md:px-16 py-4 md:py-6 rounded-full bg-black text-white">
                                    Order Now
                                </Button>
                            </Link>
                            <Link href="/">
                                <Button
                                    variant="outline"
                                    className="px-8 md:px-16 py-4 md:py-6 rounded-full hover:none"
                                >
                                    Explore More
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
                        />
                    </div>
                </section>

                {/* popular section */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 gap-y-20 my-4 py-12">
                    
                </section>

                <section className=" my-4 py-12 flex flex-col items-center justify-center">
                    <h2 className="text-5xl md:text-5xl font-bold tracking-wider uppercase text-neutral-700 my-4">
                        Why choose us?
                    </h2>
                    <p className="w-full text-center md:w-[560px] text-base text-neutral-500 my-2">
                        Experience exceptional service, fresh ingredients, and mouthwatering dishes 
                        crafted by our expert chefs. We pride ourselves on quality, convenience,
                        and bringing delicious meals right to your doorstep.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full my-6 mt-20">
                        
                    </div>
                </section>

                <section className=" my-4 py-12 flex flex-col items-center justify-center">
                    <h2 className="text-5xl md:text-5xl font-bold tracking-wider uppercase text-neutral-700 my-4">
                        Our Special Chefs
                    </h2>
                    <p className="w-full text-center md:w-[560px] text-base text-neutral-500 my-2">
                        Meet our talented culinary artists who bring passion and expertise to every dish. 
                        Our chefs combine years of experience with creative innovation to craft 
                        unforgettable dining experiences.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full my-6 mt-20">
                        
                    </div>
                </section>
            </Container>
        </>
    );
}
