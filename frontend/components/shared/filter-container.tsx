"use client";

import { cn } from "@/lib/utils";
import { Box } from "@/components/shared/box";

interface FilterContainerProps {
    children: React.ReactNode;
    className?: string;
}

export const FilterContainer = ({
    children,
    className,
}: FilterContainerProps) => {
    return <Box className={cn("flex-col gap-4", className)}>{children}</Box>;
};
