"use client";

import { useGetAllMenuItemsQuery } from "@/store/reducers/menu/api";
import { Box } from "@/components/shared/box";
import { Container } from "@/components/shared/container";
import React, { useEffect, useState } from "react";
import { FilterContainer } from "@/components/shared/filter-container";
import { Category } from "@/models/category.interface";
import { SizeFilter } from "@/components/filters/size-filter";
import { CategoryFilter } from "@/components/filters/category-filter";
import { MenuContent } from "@/components/menu/menu-content";
import { Size } from "@/models/size.interface";
import Spinner from "@/components/shared/spinner";
import { useGetCategoriesQuery } from "@/store/reducers/category/api";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
// export const revalidate = 0;


const MenuPage = () => {
    const searchParams = useSearchParams();
    const initialPage = Number(searchParams.get("page")) || 1;
    const router = useRouter();
    const [page, setPage] = useState(initialPage);
    const { data: menuItemsData, isLoading: isLoadingMenuItems } = useGetAllMenuItemsQuery({
        page,
        limit: 9,
    });
    const { data: categoriesData, isLoading: isLoadingCategories } = useGetCategoriesQuery();

    const categories = categoriesData?.data || [];
    const sizes: Size[] = [
        {
            id: "1",
            name: "Small",
            value: "S",
        },
        {
            id: "2",
            name: "Medium",
            value: "M",
        },
        {
            id: "3",
            name: "Large",
            value: "L",
        },
        {
            id: "4",
            name: "Extra Large",
            value: "XL",
        },
    ];

    useEffect(() => {
        const url = new URL(window.location.href);
        url.searchParams.set("page", page.toString());
        router.push(url.pathname + url.search);
    }, [page, router]);

    return (
        <Container className="px-4 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-12 py-12 gap-2">
                <div className="hidden md:block col-span-2 border-r border-gray-100 top-24">
                    <FilterContainer>
                        <CategoryFilter categories={categories} isLoading={isLoadingCategories} />
                        <SizeFilter sizes={sizes} />
                    </FilterContainer>
                </div>

                {isLoadingMenuItems ? (
                    <div className="col-span-12 md:col-span-10 flex items-center justify-center min-h-[50vh]">
                        <Spinner />
                    </div>
                ) : (
                    <Box className="col-span-12 md:col-span-10 flex-col items-start justify-start w-full">
                        <MenuContent menuItems={menuItemsData?.data} page={page} setPage={setPage} />
                    </Box>
                )}
            </div>
        </Container>
    );
};

export default MenuPage;
