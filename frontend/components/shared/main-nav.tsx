"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

interface MainNavProps extends React.HTMLAttributes<HTMLDivElement> {
    scrolled: boolean;
}
export const MainNav = ({ scrolled, className, ...props }: MainNavProps) => {
    const pathname = usePathname();
    const params = useParams();
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
            href: "/orders",
            label: "orders",
            active: pathname === "/orders" || pathname.includes("/orders"),
        },
        {
            href: "/about",
            label: "about",
            active: pathname === "/about" || pathname.includes("/about"),
        },
        {
            href: "/contact",
            label: "contact",
            active: pathname === "/contact" || pathname.includes("/contact"),
        },
    ];
    return (
        <div className="ml-auto">
            <nav
                className={cn(
                    "flex items-center space-x-4 lg:space-x-12 pl-6",
                    className
                )}
            >
                {routes.map((route) => (
                    <Link
                        href={route.href}
                        key={route.href}
                        className={cn(
                            "text-base capitalize font-medium transition-colors hover:text-primary duration-200",
                            route.active
                                ? `${
                                      scrolled
                                          ? "text-hero font-bold"
                                          : "text-black dark:text-white"
                                  }`
                                : `${scrolled ? "text-black" : "text-white"}`
                        )}
                    >
                        {route.label}
                    </Link>
                ))}
            </nav>
        </div>
    );
};
