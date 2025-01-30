import { createApi } from "@reduxjs/toolkit/query/react";
import { MenuItem } from "@/models/restaurant.interface";
import DynamicBaseQuery from "@/store/dynamic-base-query";

export const MenuApi = createApi({
    reducerPath: "menuApi",
    refetchOnFocus: true,
    baseQuery: DynamicBaseQuery,
    tagTypes: ["MenuItem"],
    endpoints: (builder) => ({
        getMenuItems: builder.query<{ data: MenuItem[] }, string>({
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
            }),
            invalidatesTags: ["MenuItem"],
        }),
        updateMenuItem: builder.mutation<
            { data: MenuItem },
            { id: string; body: Partial<MenuItem> }
        >({
            query: ({ id, body }) => ({
                url: `menu/${id}`,
                method: "PUT",
                body,
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
    useGetMenuItemsQuery,
    useGetMenuItemQuery,
    useCreateMenuItemMutation,
    useUpdateMenuItemMutation,
    useDeleteMenuItemMutation,
} = MenuApi;
