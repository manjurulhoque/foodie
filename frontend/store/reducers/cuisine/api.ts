import { createApi } from "@reduxjs/toolkit/query/react";
import { Cuisine } from "@/models/cuisine.interface";
import DynamicBaseQuery from "@/store/dynamic-base-query";

export const CuisineApi = createApi({
    reducerPath: "cuisineApi",
    refetchOnFocus: true,
    baseQuery: DynamicBaseQuery,
    tagTypes: ["Cuisine"],
    endpoints: (builder) => ({
        getCuisines: builder.query<{ data: Cuisine[] }, void>({
            query: () => "cuisines",
            providesTags: ["Cuisine"],
        }),
        getCuisine: builder.query<{ data: Cuisine }, string>({
            query: (id) => `cuisines/${id}`,
            providesTags: ["Cuisine"],
        }),
        createCuisine: builder.mutation<
            { data: Cuisine },
            { name: string; description: string; is_active: boolean }
        >({
            query: (body) => ({
                url: "cuisines",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Cuisine"],
        }),
        updateCuisine: builder.mutation<
            { data: Cuisine },
            {
                id: string;
                body: { name: string; description: string; is_active: boolean };
            }
        >({
            query: ({ id, body }) => ({
                url: `cuisines/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Cuisine"],
        }),
    }),
});

export const {
    useGetCuisinesQuery,
    useGetCuisineQuery,
    useCreateCuisineMutation,
    useUpdateCuisineMutation,
} = CuisineApi;
