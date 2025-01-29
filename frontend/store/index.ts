import { configureStore } from "@reduxjs/toolkit";
import { UserApi } from "@/store/reducers/user/api";
import { RestaurantApi } from "@/store/reducers/restaurant/api";
import { MenuApi } from "@/store/reducers/menu/api";

export const store: any = configureStore({
    reducer: {
        [UserApi.reducerPath]: UserApi.reducer,
        [RestaurantApi.reducerPath]: RestaurantApi.reducer,
        [MenuApi.reducerPath]: MenuApi.reducer,
    },
    devTools: true,
    middleware: (getDefaultMiddleware: any) =>
        getDefaultMiddleware({}).concat(
            UserApi.middleware,
            RestaurantApi.middleware,
            MenuApi.middleware
        ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
