import { createApi } from "@reduxjs/toolkit/query/react";
import { Order } from "@/models/order.interface";
import DynamicBaseQuery from "@/store/dynamic-base-query";

export const OrderApi = createApi({
    reducerPath: "orderApi",
    refetchOnFocus: true,
    baseQuery: DynamicBaseQuery,
    tagTypes: ["Order"],
    endpoints: (builder) => ({
        createOrder: builder.mutation<
            { data: Order },
            { delivery_address: string }
        >({
            query: (body) => ({
                url: "orders",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Order"],
        }),
        getOrders: builder.query<{ data: Order[] }, void>({
            query: () => "orders",
            providesTags: ["Order"],
        }),
    }),
});

export const { useCreateOrderMutation, useGetOrdersQuery } = OrderApi;
