import { Order } from "@/models/order.interface";
import { Restaurant } from "@/models/restaurant.interface";
import { Response } from "@/models/response.interface";
import DynamicBaseQuery from "@/store/dynamic-base-query";
import { createApi } from "@reduxjs/toolkit/query/react";

export const OwnerApi = createApi({
    reducerPath: "ownerApi",
    baseQuery: DynamicBaseQuery,
    tagTypes: ["Owner"],
    endpoints: (builder) => ({
        getOwnerRestaurants: builder.query<Response<Restaurant[]>, void>({
            query: () => "/owner/restaurants",
        }),
        getOwnerOrders: builder.query<Response<Order[]>, void>({
            query: () => "/owner/orders",
        }),
        updateOrderStatus: builder.mutation<Response<Order>, { id: number; status: string }>({
            query: ({ id, status }) => ({
                url: `/owner/orders/${id}`,
                method: "PUT",
                body: { status },
            }),
        }),
    }),
});

export const {
    useGetOwnerRestaurantsQuery,
    useGetOwnerOrdersQuery,
    useUpdateOrderStatusMutation,
} = OwnerApi;
