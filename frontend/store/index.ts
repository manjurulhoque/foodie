import { configureStore } from "@reduxjs/toolkit";
import { UserApi } from "@/store/reducers/user/api";
import { RestaurantApi } from "@/store/reducers/restaurant/api";
import { MenuApi } from "@/store/reducers/menu/api";
import { CategoryApi } from "@/store/reducers/category/api";
import { CuisineApi } from "@/store/reducers/cuisine/api";

export const store: any = configureStore({
    reducer: {
        [UserApi.reducerPath]: UserApi.reducer,
        [RestaurantApi.reducerPath]: RestaurantApi.reducer,
        [MenuApi.reducerPath]: MenuApi.reducer,
        [CategoryApi.reducerPath]: CategoryApi.reducer,
        [CuisineApi.reducerPath]: CuisineApi.reducer,
    },
    devTools: true,
    middleware: (getDefaultMiddleware: any) =>
        getDefaultMiddleware({}).concat(
            UserApi.middleware,
            RestaurantApi.middleware,
            MenuApi.middleware,
            CategoryApi.middleware,
            CuisineApi.middleware,
        ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
