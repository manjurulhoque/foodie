import { configureStore } from "@reduxjs/toolkit";

export const store: any = configureStore({
    reducer: {},
    devTools: true,
    middleware: (getDefaultMiddleware: any) =>
        getDefaultMiddleware({}).concat(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
