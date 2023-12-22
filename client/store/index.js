import { configureStore } from "@reduxjs/toolkit";
import listings from "./listings";
import comments from "./comments";

export const store = configureStore({
  reducer: {
    listings,
    comments,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
