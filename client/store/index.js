import { configureStore } from "@reduxjs/toolkit";
import listings from "./listings";

export const store = configureStore({
  reducer: {
    listings,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
