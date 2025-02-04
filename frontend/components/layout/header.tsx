"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Home } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
    fixed?: boolean;
    ref?: React.Ref<HTMLElement>;
}

export const Header = ({
    className,
    fixed,
    children,
    ...props
}: HeaderProps) => {
    const [offset, setOffset] = React.useState(0);
    const router = useRouter();
    
    React.useEffect(() => {
        const onScroll = () => {
            setOffset(
                document.body.scrollTop || document.documentElement.scrollTop
            );
        };

        // Add scroll listener to the body
        document.addEventListener("scroll", onScroll, { passive: true });

        // Clean up the event listener on unmount
        return () => document.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header
            className={cn(
                "flex items-center gap-3 sm:gap-4 bg-background p-4 h-16",
                fixed &&
                    "header-fixed peer/header w-[inherit] fixed z-50 rounded-md",
                offset > 10 && fixed ? "shadow" : "shadow-none",
                className
            )}
            {...props}
        >
            <SidebarTrigger
                variant="outline"
                className="scale-125 sm:scale-100"
            />
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-3">
                <Button
                    variant="outline"
                    size="icon"
                    className="scale-125 sm:scale-100"
                    onClick={() => router.push("/")}
                >
                    <Home />
                </Button>
            </div>
            {children}
        </header>
    );
};

Header.displayName = "Header";
