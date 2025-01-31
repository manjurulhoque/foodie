import { createApi } from "@reduxjs/toolkit/query/react";
import { Category } from "@/models/category.interface";
import DynamicBaseQuery from "@/store/dynamic-base-query";

export const CategoryApi = createApi({
    reducerPath: "categoryApi",
    refetchOnFocus: true,
    baseQuery: DynamicBaseQuery,
    tagTypes: ["Category"],
    endpoints: (builder) => ({
        getCategories: builder.query<{ data: Category[] }, void>({
            query: () => "categories",
            providesTags: ["Category"],
        }),
        getCategory: builder.query<{ data: Category }, string>({
            query: (id) => `categories/${id}`,
            providesTags: ["Category"],
        }),
        createCategory: builder.mutation<
            { data: Category },
            { name: string; description: string; is_active: boolean }
        >({
            query: (body) => ({
                url: "categories",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Category"],
        }),
        updateCategory: builder.mutation<
            { data: Category },
            {
                id: string;
                body: { name: string; description: string; is_active: boolean };
            }
        >({
            query: ({ id, body }) => ({
                url: `categories/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Category"],
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useGetCategoryQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
} = CategoryApi;
