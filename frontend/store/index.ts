import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { UserApi } from "@/store/reducers/user/api";
import { RestaurantApi } from "@/store/reducers/restaurant/api";
import { MenuApi } from "@/store/reducers/menu/api";
import { CategoryApi } from "@/store/reducers/category/api";
import { CuisineApi } from "@/store/reducers/cuisine/api";
import { CartApi } from "@/store/reducers/cart/api";
import { OrderApi } from "@/store/reducers/order/api";
import { CustomerApi } from "@/store/reducers/customer/api";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const store: any = configureStore({
    reducer: {
        [UserApi.reducerPath]: UserApi.reducer,
        [RestaurantApi.reducerPath]: RestaurantApi.reducer,
        [MenuApi.reducerPath]: MenuApi.reducer,
        [CategoryApi.reducerPath]: CategoryApi.reducer,
        [CuisineApi.reducerPath]: CuisineApi.reducer,
        [CartApi.reducerPath]: CartApi.reducer,
        [OrderApi.reducerPath]: OrderApi.reducer,
        [CustomerApi.reducerPath]: CustomerApi.reducer,
    },
    devTools: true, // TODO: remove this in production
    middleware: (getDefaultMiddleware: any) =>
        getDefaultMiddleware({}).concat(
            UserApi.middleware,
            RestaurantApi.middleware,
            MenuApi.middleware,
            CategoryApi.middleware,
            CuisineApi.middleware,
            CartApi.middleware,
            OrderApi.middleware,
            CustomerApi.middleware
        ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
