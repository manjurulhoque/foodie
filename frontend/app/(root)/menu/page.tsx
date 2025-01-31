"use client";

import { useGetAllMenuItemsQuery } from "@/store/reducers/menu/api";
import { Box } from "@/components/shared/box";
import { Container } from "@/components/shared/container";
import React from "react";
import { FilterContainer } from "@/components/shared/filter-container";
import { Category } from "@/models/category.interface";
import { SizeFilter } from "@/components/filters/size-filter";
import { CategoryFilter } from "@/components/filters/category-filter";
import { MenuContent } from "@/components/menu/menu-content";
import { Size } from "@/models/size.interface";
import Spinner from "@/components/shared/spinner";

// export const revalidate = 0;

interface MenuPageProps {
    searchParams: {
        size?: string;
        isFeatured?: boolean;
        cuisine?: string;
        category?: string;
        kitchen?: string;
    };
}

const MenuPage = ({ searchParams }: MenuPageProps) => {
    const { data: menuItems, isLoading: isLoadingMenuItems } = useGetAllMenuItemsQuery();
    const categories: Category[] = [
        {
            id: "1",
            name: "Burger",
        },
        {
            id: "2",
            name: "Pizza",
        },
        {
            id: "3",
            name: "Salad",
        },
        {
            id: "4",
            name: "Dessert",
        },
        {
            id: "5",
            name: "Drink",
        },
        {
            id: "6",
            name: "Soup",
        },
    ];
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

    return (
        <Container className="px-4 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-12 py-12 gap-2">
                <div className="hidden md:block col-span-2 border-r border-gray-100 top-24">
                    <FilterContainer>
                        <CategoryFilter categories={categories} />
                        <SizeFilter sizes={sizes} />
                    </FilterContainer>
                </div>

                {
                    isLoadingMenuItems ? (
                        <div className="col-span-12 md:col-span-10 flex items-center justify-center min-h-[50vh]">
                            <Spinner />
                        </div>
                    ) : (
                        <Box className="col-span-12 md:col-span-10 flex-col items-start justify-start w-full">
                            <MenuContent menuItems={menuItems?.data} />
                        </Box>
                    )
                }
            </div>
        </Container>
    );
};

export default MenuPage;
