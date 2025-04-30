import { Order } from "@/models/order.interface";
import { Restaurant } from "@/models/restaurant.interface";
import { Response } from "@/models/response.interface";
import { MenuItem } from "@/models/menu-item.interface";
import DynamicBaseQuery from "@/store/dynamic-base-query";
import { createApi } from "@reduxjs/toolkit/query/react";

export const OwnerApi = createApi({
    reducerPath: "ownerApi",
    baseQuery: DynamicBaseQuery,
    tagTypes: ["Owner", "MenuItem"],
    endpoints: (builder) => ({
        getOwnerRestaurants: builder.query<Response<Restaurant[]>, void>({
            query: () => "/owner/restaurants",
        }),
        getOwnerOrders: builder.query<Response<Order[]>, void>({
            query: () => "/owner/orders",
        }),
        updateOrderStatus: builder.mutation<Response<Order>, { id: number; status: string; payment_status: string }>({
            query: ({ id, status, payment_status }) => ({
                url: `/owner/orders/${id}`,
                method: "PUT",
                body: { status, payment_status },
            }),
        }),
        // Menu Item Endpoints
        getRestaurantMenuItems: builder.query<Response<MenuItem[]>, number>({
            query: (restaurantId) => `restaurants/${restaurantId}/menu`,
            providesTags: ["MenuItem"],
        }),
        updateMenuItem: builder.mutation<
            Response<MenuItem>,
            { id: number; data: FormData }
        >({
            query: ({ id, data }) => ({
                url: `owner/menu/${id}`,
                method: "PUT",
                body: data,
                formData: true,
            }),
            invalidatesTags: ["MenuItem"],
        }),
        deleteMenuItem: builder.mutation<void, number>({
            query: (id) => ({
                url: `owner/menu/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["MenuItem"],
        }),
    }),
});

export const {
    useGetOwnerRestaurantsQuery,
    useGetOwnerOrdersQuery,
    useUpdateOrderStatusMutation,
    useGetRestaurantMenuItemsQuery,
    useUpdateMenuItemMutation,
    useDeleteMenuItemMutation,
} = OwnerApi;
