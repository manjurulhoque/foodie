import { configureStore } from "@reduxjs/toolkit";
import { UserApi } from "@/store/reducers/user/api";
import { RestaurantApi } from "@/store/reducers/restaurant/api";
import { MenuApi } from "@/store/reducers/menu/api";
import { CategoryApi } from "@/store/reducers/category/api";

export const store: any = configureStore({
    reducer: {
        [UserApi.reducerPath]: UserApi.reducer,
        [RestaurantApi.reducerPath]: RestaurantApi.reducer,
        [MenuApi.reducerPath]: MenuApi.reducer,
        [CategoryApi.reducerPath]: CategoryApi.reducer,
    },
    devTools: true,
    middleware: (getDefaultMiddleware: any) =>
        getDefaultMiddleware({}).concat(
            UserApi.middleware,
            RestaurantApi.middleware,
            MenuApi.middleware,
            CategoryApi.middleware,
        ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
