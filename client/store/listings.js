import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { databases } from "../configs/appwrite";
import { Query } from "appwrite";
import { client } from "../configs/axios";

export const fetchAllCategories = createAsyncThunk(
  "listings/categories/fetch",
  async () => {
    try {
      const response = await client.get("/categories");
      return response.data.documents;
    } catch (error) {
      console.log("categories fetch error", error.response.data);
    }
  }
);

export const fetchAllListings = createAsyncThunk(
  "listings/fetch",
  async (params, { dispatch }) => {
    try {
      const response = await client.get("/listings");
      return response.data.documents;
    } catch (error) {
      console.log("listings fetch error", error.response.data);
    }
  }
);

export const updateViews = createAsyncThunk(
  "listings/views/update",
  async (params, { dispatch }) => {
    try {
      await databases.updateDocument("madhyayuga", "listings", params.$id, {
        views: params.views + 1,
      });
      dispatch(fetchAllListings({ limit: params.limit }));
    } catch (error) {
      console.log("update listing views error", error);
    }
  }
);

export const userListings = createAsyncThunk(
  "users/listings/fetch",
  async (params) => {
    try {
      const response = await client.get("/listings/my");

      return response.data.documents;
    } catch (error) {
      console.log("cannot fetch listings of user", error);
    }
  }
);

const initialState = {
  listings: [],
  comments: {},
  userListings: [],
  categories: [],
};

const listings = createSlice({
  name: "listings",

  initialState,
  reducers: {},
  extraReducers: {
    [fetchAllCategories.pending]: () => {
      console.log("fetching all categories");
    },
    [fetchAllCategories.fulfilled]: (state, { payload }) => {
      console.log("fetching all categories fullfilled");
      return { ...state, categories: payload };
    },
    [fetchAllCategories.rejected]: () => {
      console.log("fetching all categories rejected");
    },
    [fetchAllListings.pending]: () => {
      console.log("fetching all listings");
    },
    [fetchAllListings.fulfilled]: (state, { payload }) => {
      console.log("fetching all listings fullfilled");
      return { ...state, listings: payload };
    },
    [fetchAllListings.rejected]: () => {
      console.log("fetching all listings rejected");
    },
    [userListings.pending]: () => {
      console.log("fetching user listings");
    },
    [userListings.fulfilled]: (state, { payload }) => {
      console.log("fetching user listings fullfilled");
      return { ...state, userListings: payload };
    },
    [userListings.rejected]: () => {
      console.log("fetching user listings rejected");
    },
  },
});

export default listings.reducer;

export const getAllListings = (state) => state.listings.listings;
export const getAllCategories = (state) => state.listings.categories;
export const getUserListings = (state) => state.listings.userListings;
