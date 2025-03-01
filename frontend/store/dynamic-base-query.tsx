import { getSession } from "next-auth/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const DynamicBaseQuery = async (args: any, api: any, extraOptions: any) => {
    const session = await getSession();
    let BACKEND_BASE_URL;
    if (typeof window !== "undefined") {
        BACKEND_BASE_URL = process.env.BACKEND_BASE_URL;
    } else {
        BACKEND_BASE_URL = process.env.BACKEND_BASE_URL;
    }
    return fetchBaseQuery({
        baseUrl: `${BACKEND_BASE_URL}/api`,
        prepareHeaders: (headers) => {
            if (session?.access) {
                headers.set("Authorization", `Bearer ${session.access}`);
            }
            // headers.set("Access-Control-Allow-Origin", "*");
            // headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            // headers.set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With");
            return headers;
        },
    })(args, api, extraOptions);
};

export default DynamicBaseQuery;
