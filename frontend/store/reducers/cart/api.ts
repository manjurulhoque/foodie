import { createApi } from "@reduxjs/toolkit/query/react";
import { Cart, CartItem } from "@/models/cart.interface";
import DynamicBaseQuery from "@/store/dynamic-base-query";

export const CartApi = createApi({
    reducerPath: "cartApi",
    refetchOnFocus: true,
    baseQuery: DynamicBaseQuery,
    tagTypes: ["Cart"],
    endpoints: (builder) => ({
        getCart: builder.query<{ data: Cart }, void>({
            query: () => "cart",
            providesTags: ["Cart"],
        }),
        addToCart: builder.mutation<
            { data: Cart },
            { menu_item_id: number; quantity: number }
        >({
            query: (body) => ({
                url: "cart/items",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Cart"],
        }),
        updateCartItem: builder.mutation<
            { data: Cart },
            { id: number; quantity: number }
        >({
            query: ({ id, ...body }) => ({
                url: `cart/items/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Cart"],
        }),
        removeFromCart: builder.mutation<{ data: Cart }, number>({
            query: (id) => ({
                url: `cart/items/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Cart"],
        }),
        clearCart: builder.mutation<void, void>({
            query: () => ({
                url: "cart",
                method: "DELETE",
            }),
            invalidatesTags: ["Cart"],
        }),
    }),
});

export const {
    useGetCartQuery,
    useAddToCartMutation,
    useUpdateCartItemMutation,
    useRemoveFromCartMutation,
    useClearCartMutation,
} = CartApi;
