import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

// slices
import authSlice from "./features/authSlice";

// apis
import authApi from "./services/authApi";
import taskApi from "./services/taskApi";
import clientApi from "./services/clientApi";
import projectApi from "./services/projectApi";
import messageApi from "./services/messageApi";

// Store
export const store = configureStore({
  reducer: {
    auth: authSlice,
    [taskApi.reducerPath]: taskApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [clientApi.reducerPath]: clientApi.reducer,
    [projectApi.reducerPath]: projectApi.reducer,
    [messageApi.reducerPath]: messageApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      taskApi.middleware,
      clientApi.middleware,
      projectApi.middleware,
      messageApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// for rtk query
setupListeners(store.dispatch);

// custom hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
