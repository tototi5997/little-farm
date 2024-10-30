import { configureStore } from "@reduxjs/toolkit";
import { useSelector, useDispatch } from "react-redux";
import solidReducer from "./Solid/reducer";
import packageReducer from "./Package/reducer";
import eventsReducer from "./Events/reducer";

const store = configureStore({
  reducer: {
    solid: solidReducer,
    package: packageReducer,
    events: eventsReducer,
  },
});

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppState = useSelector.withTypes<AppState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
