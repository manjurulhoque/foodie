"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MainNav } from "@/components/shared/main-nav";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Settings, ShoppingBag } from "lucide-react";

interface HeaderProps {
    userId?: string | null;
}

export const Header = ({ userId }: HeaderProps) => {
    const [scrolled, setScrolled] = useState(false);
    const isLoggedIn = !!userId;

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

                    <div className="flex items-center justify-between space-x-2 md:justify-end">
                        {isLoggedIn ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="relative h-8 w-8 rounded-full"
                                    >
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage
                                                src="/avatars/01.png"
                                                alt="@username"
                                            />
                                            <AvatarFallback>UN</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-56"
                                    align="end"
                                    forceMount
                                >
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                username
                                            </p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                user@example.com
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <ShoppingBag className="mr-2 h-4 w-4" />
                                        <span>Orders</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link href="/signin">
                                    <Button size="sm" variant="outline">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/signup">
                                    <Button size="sm">Sign Up</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        </header>
    );
};
