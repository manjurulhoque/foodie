import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Restaurant } from "@/models/restaurant.interface";
import DynamicBaseQuery from "@/store/dynamic-base-query";

export const RestaurantApi = createApi({
    reducerPath: "restaurantApi",
    refetchOnFocus: true,
    baseQuery: DynamicBaseQuery,
    tagTypes: ["Restaurant"],
    endpoints: (builder) => ({
        getRestaurants: builder.query<{ data: Restaurant[] }, void>({
            query: () => "restaurants",
            providesTags: ["Restaurant"],
        }),
        getRestaurant: builder.query<{ data: Restaurant }, string>({
            query: (id) => `restaurants/${id}`,
            providesTags: ["Restaurant"],
        }),
        createRestaurant: builder.mutation<
            { data: Restaurant },
            Partial<Restaurant>
        >({
            query: (body) => ({
                url: "restaurants",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Restaurant"],
        }),
        updateRestaurant: builder.mutation<
            { data: Restaurant },
            { id: string; body: Partial<Restaurant> }
        >({
            query: ({ id, body }) => ({
                url: `restaurants/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Restaurant"],
        }),
        deleteRestaurant: builder.mutation<void, string>({
            query: (id) => ({
                url: `restaurants/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Restaurant"],
        }),
    }),
});

export const {
    useGetRestaurantsQuery,
    useGetRestaurantQuery,
    useCreateRestaurantMutation,
    useUpdateRestaurantMutation,
    useDeleteRestaurantMutation,
} = RestaurantApi;
