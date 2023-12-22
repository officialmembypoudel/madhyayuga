import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { client } from "../configs/axios";

// Redux Thunk to fetch all categories
export const fetchAllComments = createAsyncThunk(
  "listings/comments/fetch",
  async ({ listingId }) => {
    try {
      // Fetch comments from the server
      const response = await client.get("/listings/" + listingId + "/comments");
      return response.data.documents;
    } catch (error) {
      // Log and rethrow the error to propagate it
      console.error("comments fetch error", error.response.data);
      throw error;
    }
  }
);

// Initial state for the listings slice
const initialState = {
  comments: {},
};

// Redux Toolkit slice for managing comments state
const comments = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Reducer cases for fetch all comments
      .addCase(fetchAllComments.pending, (state) => {
        console.log("fetching all comments");
      })
      .addCase(fetchAllComments.fulfilled, (state, { payload }) => {
        console.log("fetching all comments fulfilled");
        state.comments = payload;
      })
      .addCase(fetchAllComments.rejected, (state) => {
        console.log("fetching all comments rejected");
      });
  },
});

// Export the listings reducer
export default comments.reducer;

// Selectors to get specific parts of the comments state
export const getAllComments = (state) => state.comments.comments;
