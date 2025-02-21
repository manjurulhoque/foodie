import { createApi } from "@reduxjs/toolkit/query/react";
import DynamicBaseQuery from "@/store/dynamic-base-query";
import { User } from "@/models/user.interface";
import { Response } from "@/models/response.interface";

export const UserApi = createApi({
    reducerPath: "userApi",
    refetchOnFocus: true,
    baseQuery: DynamicBaseQuery,
    tagTypes: ["User"],
    endpoints: (builder) => ({
        me: builder.query<Response<User>, null>({
            query: () => ({ url: "/me", method: "GET" }),
            providesTags: ["User"],
            keepUnusedDataFor: 300, // Cache data for 5 minutes (300 seconds)
        }),
        updateUser: builder.mutation<Response<User>, { name: string, email: string, phone: string }>({
            query: (user) => ({ url: "/me", method: "PUT", body: user }),
            invalidatesTags: ["User"],
        }),
        getAllUsers: builder.query<Response<User[]>, void>({
            query: () => ({ url: "/users", method: "GET" }),
            providesTags: ["User"],
            keepUnusedDataFor: 300, // Cache data for 5 minutes (300 seconds)
        }),
    }),
});

export const { useMeQuery, useGetAllUsersQuery, useUpdateUserMutation } = UserApi;
