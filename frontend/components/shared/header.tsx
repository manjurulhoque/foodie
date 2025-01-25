"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MainNav } from "@/components/shared/main-nav";
import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";

interface HeaderProps {
    userId?: string | null;
}

export const Header = ({ userId }: HeaderProps) => {
    const [scrolled, setScrolled] = useState(false);

    // useEffect(() => {
    //     const handleScroll = () => {
    //         const isScrolled = window.scrollY > 0;
    //         setScrolled(isScrolled);
    //     };

    //     window.addEventListener("scroll", handleScroll);

    //     return () => window.addEventListener("scroll", handleScroll);
    // }, []);

    return (
        <header
            className={cn(
                "w-full z-50 transition",
                scrolled
                    ? "fixed top-0 left-0 bg-white shadow-lg"
                    : "bg-transparent"
            )}
        >
            <Container>
                <div className="relative px-4 sm:px-6 lg:px-12 flex h-16 items-center">
                    <Link
                        href="/"
                        className="uppercase flex gap-x-2 font-bold text-neutral-700 text-md lg:text-2xl md:text-xl select-none"
                    >
                        Foodie
                    </Link>

                    <MainNav scrolled={scrolled} className="mr-8" />

                    <div className="flex items-center space-x-4 ml-4">
                        <Link href={"/signin"}>
                            <Button size="sm" variant="outline">
                                Sign In
                            </Button>
                        </Link>
                        <Link href={"/signup"}>
                            <Button size="sm">Sign Up</Button>
                        </Link>
                    </div>
                </div>
            </Container>
        </header>
    );
};
