"use client";

import { Box } from "@/components/shared/box";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { Category } from "@/models/category.interface";
interface CategoryFilterProps {
    categories: Category[];
}

export const CategoryFilter = ({ categories }: CategoryFilterProps) => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const handleClick = (category: string) => {
        const currentParams = Object.fromEntries(searchParams.entries());
        if (currentParams.category === category) {
            delete currentParams.category;
        } else {
            currentParams.category = category;
        }

        const href = qs.stringifyUrl({
            url: "/menu",
            query: currentParams,
        });

        router.push(href);
    };

    return (
        <Box className="flex-col gap-2 border-b pb-4 cursor-pointer">
            <h2 className="text-xl font-semibold text-neutral-700">
                Categories
            </h2>
            <Box className="flex-col gap-2 mt-2">
                {categories.map((category) => (
                    <div
                        onClick={() => handleClick(category.name)}
                        className={cn(
                            "text-sm font-semibold text-neutral-500 flex items-center gap-2",
                            category.name === searchParams.get("category") &&
                                "text-hero"
                        )}
                        key={category.id}
                    >
                        <p>{category.name}</p>
                        {category.name === searchParams.get("category") && (
                            <Check className="w-4 h-4 text-hero" />
                        )}
                    </div>
                ))}
            </Box>
        </Box>
    );
};
