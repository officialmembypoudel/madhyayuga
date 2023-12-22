import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { databases } from "../configs/appwrite";
import { client } from "../configs/axios";

// Redux Thunk to fetch all categories
export const fetchAllCategories = createAsyncThunk(
  "listings/categories/fetch",
  async () => {
    try {
      // Fetch categories from the server
      const response = await client.get("/categories");
      return response.data.documents;
    } catch (error) {
      // Log and rethrow the error to propagate it
      console.error("categories fetch error", error.response.data);
      throw error;
    }
  }
);

// Redux Thunk to fetch all listings
export const fetchAllListings = createAsyncThunk(
  "listings/fetch",
  async (_, { dispatch }) => {
    try {
      // Fetch listings from the server
      const response = await client.get("/listings");
      return response.data.documents;
    } catch (error) {
      // Log and rethrow the error to propagate it
      console.error("listings fetch error", error.response.data);
      throw error;
    }
  }
);

// Redux Thunk to update views for a listing
export const updateViews = createAsyncThunk(
  "listings/views/update",
  async (params, { dispatch }) => {
    try {
      // Update views for a listing in the database
      await databases.updateDocument("madhyayuga", "listings", params.$id, {
        views: params.views + 1,
      });
      // Dispatch a new fetchAllListings action to refresh the listings after updating views
      dispatch(fetchAllListings({ limit: params.limit }));
    } catch (error) {
      // Log and rethrow the error to propagate it
      console.error("update listing views error", error);
      throw error;
    }
  }
);

// Redux Thunk to fetch listings for a specific user
export const userListings = createAsyncThunk(
  "users/listings/fetch",
  async () => {
    try {
      // Fetch listings for the current user from the server
      const response = await client.get("/listings/my");
      return response.data.documents;
    } catch (error) {
      // Log and rethrow the error to propagate it
      console.error("cannot fetch listings of user", error);
      throw error;
    }
  }
);

// Initial state for the listings slice
const initialState = {
  listings: [],
  comments: {},
  userListings: [],
  categories: [],
};

// Redux Toolkit slice for managing listings state
const listings = createSlice({
  name: "listings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Reducer cases for fetchAllCategories
      .addCase(fetchAllCategories.pending, (state) => {
        console.log("fetching all categories");
      })
      .addCase(fetchAllCategories.fulfilled, (state, { payload }) => {
        console.log("fetching all categories fulfilled");
        state.categories = payload;
      })
      .addCase(fetchAllCategories.rejected, (state) => {
        console.log("fetching all categories rejected");
      })
      // Reducer cases for fetchAllListings
      .addCase(fetchAllListings.pending, (state) => {
        console.log("fetching all listings");
      })
      .addCase(fetchAllListings.fulfilled, (state, { payload }) => {
        console.log("fetching all listings fulfilled");
        state.listings = payload;
      })
      .addCase(fetchAllListings.rejected, (state) => {
        console.log("fetching all listings rejected");
      })
      // Reducer cases for userListings
      .addCase(userListings.pending, (state) => {
        console.log("fetching user listings");
      })
      .addCase(userListings.fulfilled, (state, { payload }) => {
        console.log("fetching user listings fulfilled");
        state.userListings = payload;
      })
      .addCase(userListings.rejected, (state) => {
        console.log("fetching user listings rejected");
      });
  },
});

// Export the listings reducer
export default listings.reducer;

// Selectors to get specific parts of the listings state
export const getAllListings = (state) => state.listings.listings;
export const getAllCategories = (state) => state.listings.categories;
export const getUserListings = (state) => state.listings.userListings;
