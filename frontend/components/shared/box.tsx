import { cn } from "@/lib/utils";
import React from "react";

interface BoxProps {
    children: React.ReactNode;
    className: string;
}

export const Box = ({ children, className }: BoxProps) => {
    return (
        <div
            className={cn(
                "mx-auto w-full flex items-start justify-start",
                className
            )}
        >
            {children}
        </div>
    );
};
