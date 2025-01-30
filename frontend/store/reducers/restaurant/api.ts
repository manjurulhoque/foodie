import { createApi } from "@reduxjs/toolkit/query/react";
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
            { data: Partial<Restaurant> },
            FormData
        >({
            query: (formData) => ({
                url: "restaurants",
                method: "POST",
                body: formData,
                formData: true,
            }),
            invalidatesTags: ["Restaurant"],
        }),
        updateRestaurant: builder.mutation<
            { data: Partial<Restaurant> },
            { id: string; body: FormData }
        >({
            query: ({ id, body }) => ({
                url: `restaurants/${id}`,
                method: "PUT",
                body,
                formData: true,
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
