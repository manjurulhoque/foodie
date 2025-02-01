import { createApi } from "@reduxjs/toolkit/query/react";
import { MenuItem } from "@/models/restaurant.interface";
import DynamicBaseQuery from "@/store/dynamic-base-query";

export const MenuApi = createApi({
    reducerPath: "menuApi",
    refetchOnFocus: true,
    baseQuery: DynamicBaseQuery,
    tagTypes: ["MenuItem"],
    endpoints: (builder) => ({
        getAllMenuItems: builder.query<{ data: MenuItem[] }, void>({
            query: () => `menu`,
            providesTags: ["MenuItem"],
        }),
        getRestaurantMenuItems: builder.query<{ data: MenuItem[] }, number>({
            query: (restaurantId) => `restaurants/${restaurantId}/menu`,
            providesTags: ["MenuItem"],
        }),
        getMenuItem: builder.query<{ data: MenuItem }, string>({
            query: (id) => `menu/${id}`,
            providesTags: ["MenuItem"],
        }),
        createMenuItem: builder.mutation<
            { data: MenuItem },
            { restaurantId: string; body: FormData }
        >({
            query: ({ restaurantId, body }) => ({
                url: `restaurants/${restaurantId}/menu`,
                method: "POST",
                body,
                formData: true,
            }),
            invalidatesTags: ["MenuItem"],
        }),
        updateMenuItem: builder.mutation<
            { data: MenuItem },
            { restaurantId: string; menuId: string; body: FormData }
        >({
            query: ({ restaurantId, menuId, body }) => ({
                url: `restaurants/${restaurantId}/menu/${menuId}`,
                method: "PUT",
                body,
                formData: true,
            }),
            invalidatesTags: ["MenuItem"],
        }),
        deleteMenuItem: builder.mutation<void, string>({
            query: (id) => ({
                url: `menu/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["MenuItem"],
        }),
    }),
});

export const {
    useGetAllMenuItemsQuery,
    useGetRestaurantMenuItemsQuery,
    useGetMenuItemQuery,
    useCreateMenuItemMutation,
    useUpdateMenuItemMutation,
    useDeleteMenuItemMutation,
} = MenuApi;
