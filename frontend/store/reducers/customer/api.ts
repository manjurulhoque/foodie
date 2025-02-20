import { createApi } from "@reduxjs/toolkit/query/react";
import { Customer } from "@/models/customer.interface";
import DynamicBaseQuery from "@/store/dynamic-base-query";
import { Response } from "@/models/response.interface";

export const CustomerApi = createApi({
    reducerPath: "customerApi",
    refetchOnFocus: true,
    baseQuery: DynamicBaseQuery,
    tagTypes: ["Customer"],
    endpoints: (builder) => ({
        getCustomers: builder.query<Response<Customer[]>, void>({
            query: () => "customers",
            providesTags: ["Customer"],
        }),
    }),
});

export const { useGetCustomersQuery } = CustomerApi;
