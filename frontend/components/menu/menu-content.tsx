"use client";

import { MenuItemDetails } from "@/components/menu/menu-item-details";
import { Box } from "@/components/shared/box";
import { ChevronLeft, ChevronRight, Home, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { MenuItem } from "@/models/restaurant.interface";
import { PaginatedResponse } from "@/lib/pagination";
import { Button } from "../ui/button";

interface MenuContentProps {
    menuItems?: PaginatedResponse<MenuItem>;
    page: number;
    setPage: (page: number) => void;
}

export const MenuContent = ({ menuItems, page, setPage }: MenuContentProps) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const currentParams = Object.fromEntries(
        Array.from(searchParams.entries()).filter(([key]) => key !== 'page')
    );
    const menuItemsData = menuItems?.data;
    const meta = menuItems?.meta;

    const handleClick = (param: string) => {
        if (currentParams.hasOwnProperty(param)) {
            const newParams = { ...currentParams };
            delete newParams[param];
            const href = qs.stringifyUrl({
                url: "menu",
                query: newParams,
            });

            router.push(href);
        }
    };

    return (
        <>
            <Box className="pt-4 pb-24 flex-col items-start">
                <Box className="text-neutral-700 text-sm items-center">
                    <Link href={"/"} className="flex items-center gap-2">
                        <Home className="w-4 h-4 " />
                        Main Page
                    </Link>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    <Link href={"/menu"} className="flex items-center gap-2">
                        Menu
                    </Link>

                    {searchParams.get("category") && (
                        <>
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                            <Link
                                href={"/menu"}
                                className="flex items-center gap-2"
                            >
                                {searchParams.get("category")}
                            </Link>
                        </>
                    )}
                </Box>

                <Box className="mt-8 flex flex-col items-start ">
                    {searchParams.get("category") && (
                        <h2 className="flex items-center gap-2 text-3xl font-semibold text-neutral-700">
                            {searchParams.get("category")}
                        </h2>
                    )}
                </Box>

                <Box className="gap-3 my-4">
                    {currentParams &&
                        Object.entries(currentParams).map(([key, value]) => (
                            <div
                                key={key}
                                className="px-4 py-1 cursor-pointer hover:shadow-md rounded-md bg-emerald-500/10 text-neutral-600 flex items-center gap-1"
                                onClick={() => handleClick(key)}
                            >
                                {value}
                                <X className="w-4 h-4" />
                            </div>
                        ))}
                </Box>
            </Box>

            <div className="grid grid-cols-2 lg:grid-cols-3 w-full h-full gap-4 gap-y-24">
                {menuItemsData && menuItemsData.length > 0 ? (
                    <>
                        {menuItemsData.map((menuItem) => (
                            <MenuItemDetails menuItem={menuItem} key={menuItem.id} />
                        ))}
                    </>
                ) : (
                    <>
                        <Box className="items-center justify-center py-12 text-neutral-700 font-semibold text-2xl col-span-10">
                            No Menu Available
                        </Box>
                    </>
                )}
            </div>
            {/* Add pagination controls */}
            {meta && (
                <div className="mt-10 flex items-center justify-center gap-4">
                    <Button
                        variant="outline"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                    >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {page} of {meta.totalPages}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() => setPage(page + 1)}
                        disabled={page === meta.totalPages}
                    >
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            )}
        </>
    );
};
