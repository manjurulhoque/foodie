"use client";

import { cn } from "@/lib/utils";
import React from "react";
import Link from "next/link";
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
import {
    LogOut,
    User,
    Settings,
    ShoppingBag,
    Shield,
    ShoppingCart,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useMeQuery } from "@/store/reducers/user/api";
import { Skeleton } from "../ui/skeleton";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useGetCartQuery } from "@/store/reducers/cart/api";

export const Header = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { data, isLoading } = useMeQuery(null, {});
    const isLoggedIn = !!data?.data;
    const user = data?.data;
    const { data: cart } = useGetCartQuery();

    const routes = [
        {
            href: "/",
            label: "Home",
            active: pathname === "/",
        },
        {
            href: "/menu",
            label: "Menu",
            active: pathname === "/menu" || pathname.includes("/menu"),
        },
        {
            href: "/restaurants",
            label: "Restaurants",
            active:
                pathname === "/restaurants" ||
                pathname.includes("/restaurants"),
        },
        {
            href: "/about",
            label: "about",
            active: pathname === "/about" || pathname.includes("/about"),
        },
    ];

    const isAdmin = user?.role === "admin";
    const isCustomer = user?.role === "customer";
    const isOwner = user?.role === "owner";
    return (
        <header className="w-full z-50 transition bg-transparent">
            <Container>
                <div className="relative px-4 sm:px-6 lg:px-12 flex h-16 items-center">
                    <Link
                        href="/"
                        className="uppercase flex gap-x-2 font-bold text-neutral-700 text-md lg:text-2xl md:text-xl select-none"
                    >
                        <img
                            src="/img/logo.svg"
                            alt="Foodie"
                            className="w-40 h-20"
                        />
                    </Link>

                    <div className="ml-auto flex items-center">
                        <div className="relative w-64 mr-4">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full rounded-full border-2 px-4 py-2 text-sm outline-none transition-colors border-black/30 bg-white/20 placeholder:text-black focus:border-black"
                            />
                        </div>

                        <nav className="flex items-center space-x-4 lg:space-x-12 mr-4">
                            {routes.map((route) => (
                                <Link
                                    href={route.href}
                                    key={route.href}
                                    className={cn(
                                        "text-base capitalize font-medium transition-colors hover:text-primary duration-200",
                                        route.active
                                            ? "text-black dark:text-white"
                                            : "text-white"
                                    )}
                                >
                                    {route.label}
                                </Link>
                            ))}
                            <Link
                                href="/cart"
                                className={cn(
                                    "text-base capitalize font-medium transition-colors hover:text-primary duration-200 bg-black rounded-full p-2 flex items-center gap-1 hover:bg-black hover:text-white",
                                    pathname === "/cart"
                                        ? "text-white dark:text-white"
                                        : "text-white"
                                )}
                            >
                                <ShoppingCart className="h-4 w-4" />
                                <span className="min-w-4 text-sm">
                                    {cart?.data?.items?.length || 0}
                                </span>
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center justify-between space-x-2 md:justify-end">
                        {isLoggedIn && user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="relative h-8 w-8 rounded-full"
                                    >
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage
                                                src={user?.image}
                                                alt={user?.name}
                                            />
                                            <AvatarFallback>
                                                {user?.name?.charAt(0)}
                                            </AvatarFallback>
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
                                                {user?.name}
                                            </p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user?.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {isAdmin && (
                                        <DropdownMenuItem
                                            className="cursor-pointer"
                                            onClick={() => {
                                                router.push("/admin");
                                            }}
                                        >
                                            <Shield className="mr-2 h-4 w-4" />
                                            <span>Admin dashboard</span>
                                        </DropdownMenuItem>
                                    )}
                                    {isCustomer && (
                                        <DropdownMenuItem
                                            className="cursor-pointer"
                                            onClick={() => {
                                                router.push("/dashboard");
                                            }}
                                        >
                                            <Shield className="mr-2 h-4 w-4" />
                                            <span>Customer dashboard</span>
                                        </DropdownMenuItem>
                                    )}
                                    {isOwner && (
                                        <DropdownMenuItem
                                            className="cursor-pointer"
                                            onClick={() => {
                                                router.push("/owner/dashboard");
                                            }}
                                        >
                                            <Shield className="mr-2 h-4 w-4" />
                                            <span>Owner dashboard</span>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={() => {
                                            if (isAdmin) {
                                                router.push(
                                                    "/admin/settings/profile"
                                                );
                                            } else {
                                                router.push(
                                                    "/dashboard/settings/profile"
                                                );
                                            }
                                        }}
                                    >
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={() => {
                                            router.push("/dashboard/orders");
                                        }}
                                    >
                                        <ShoppingBag className="mr-2 h-4 w-4" />
                                        <span>Orders</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-red-600 cursor-pointer"
                                        onClick={() => {
                                            signOut();
                                        }}
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center space-x-4">
                                {isLoading ? (
                                    <Skeleton className="h-8 w-24" />
                                ) : (
                                    <>
                                        <Link href="/signin">
                                            <Button size="sm" variant="outline">
                                                Sign In
                                            </Button>
                                        </Link>
                                        <Link href="/signup">
                                            <Button size="sm">Sign Up</Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        </header>
    );
};
