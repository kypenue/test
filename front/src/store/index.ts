import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Api } from "@/services/api";

const rootReducer = combineReducers({
    [Api.reducerPath]: Api.reducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat([Api.middleware]),
});

export type AppStore = typeof store;
