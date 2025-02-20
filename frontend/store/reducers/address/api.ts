import { createApi } from "@reduxjs/toolkit/query/react";
import { Address } from "@/models/address.interface";
import DynamicBaseQuery from "@/store/dynamic-base-query";
import { Response } from "@/models/response.interface";

export const AddressApi = createApi({
    reducerPath: "addressApi",
    refetchOnFocus: true,
    baseQuery: DynamicBaseQuery,
    tagTypes: ["Address"],
    endpoints: (builder) => ({
        getAddresses: builder.query<Response<Address[]>, void>({
            query: () => "addresses",
            providesTags: ["Address"],
        }),
        createAddress: builder.mutation<Response<Address>, Partial<Address>>({
            query: (address) => ({
                url: "addresses",
                method: "POST",
                body: address,
            }),
            invalidatesTags: ["Address"],
        }),
        updateAddress: builder.mutation<
            Response<void>,
            { id: number; address: Partial<Address> }
        >({
            query: ({ id, address }) => ({
                url: `addresses/${id}`,
                method: "PUT",
                body: address,
            }),
            invalidatesTags: ["Address"],
        }),
        deleteAddress: builder.mutation<Response<void>, number>({
            query: (id) => ({
                url: `addresses/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Address"],
        }),
    }),
});

export const {
    useGetAddressesQuery,
    useCreateAddressMutation,
    useUpdateAddressMutation,
    useDeleteAddressMutation,
} = AddressApi;
