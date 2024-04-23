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
// Redux Thunk to fetch all listings
export const fetchSearchListings = createAsyncThunk(
  "listings/fetch/search",
  async (params, { dispatch }) => {
    try {
      // Fetch listings from the server
      const response = await client.get(
        "/listings/search?query=" + params?.query + "&city=" + params?.location
      );
      return response.data;
    } catch (error) {
      // Log and rethrow the error to propagate it
      console.error("listings fetch error", error.response.data);
      throw error;
    }
  }
);
// Redux Thunk to fetch all listings
export const fetchListingsByCategory = createAsyncThunk(
  "listings/fetch/search/:categoryId",
  async (params, { dispatch }) => {
    try {
      // Fetch listings from the server
      const response = await client.get(
        "/listings/search/" + params?.categoryId
      );
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

export const fetchBids = createAsyncThunk(
  "listings/bids/fetch",
  async (listingId) => {
    try {
      const response = await client.get(`/listings/${listingId}/bids`);
      return response.data.documents;
    } catch (error) {
      console.error("fetching bids error", error);
      throw error;
    }
  }
);

export const deleteBid = createAsyncThunk(
  "listings/bids/delete",
  async (bidId) => {
    try {
      const response = await client.delete(`/bids/${bidId}`);
      return response.data.documents;
    } catch (error) {
      console.error("deleting bid error", error);
      throw error;
    }
  }
);

export const addBid = createAsyncThunk("listings/bids/add", async (params) => {
  try {
    const response = await client.post(
      `/listings/${params.listingId}/bids/add`,
      {
        forId: params.forId,
      }
    );
    return response.data.documents;
  } catch (error) {
    console.error("adding bid error", error);
    throw error;
  }
});

export const addToFavourites = createAsyncThunk(
  "listings/favourites/add",
  async (params) => {
    try {
      const response = await client.post(
        `/listings/${params.listingId}/favourites/add`
      );
      return response.data;
    } catch (error) {
      console.error("adding to favourites error", error);
      throw error;
    }
  }
);

export const removeFromFavourites = createAsyncThunk(
  "listings/favourites/remove",
  async (params) => {
    try {
      const response = await client.delete(
        `/listings/favourites/${params.favouriteId}`
      );
      return response.data;
    } catch (error) {
      console.error("removing from favourites error", error);
      throw error;
    }
  }
);

export const fetchFavourites = createAsyncThunk(
  "listings/favourites/fetch",
  async () => {
    try {
      const response = await client.get("/listings/favourites/my");
      return response.data.documents;
    } catch (error) {
      console.error("fetching favourites error", error);
      throw error;
    }
  }
);

export const fetchLocations = createAsyncThunk(
  "listings/locations/fetch",
  async () => {
    try {
      const response = await client.get("/locations");
      return response.data.documents;
    } catch (error) {
      console.error("fetching locations error", error);
      throw error;
    }
  }
);

// Initial state for the listings slice
const initialState = {
  listings: [],
  listingsByCategory: [],
  comments: {},
  userListings: [],
  categories: [],
  bids: [],
  locations: [],
  favourites: [],
  searched: null,
};

// Redux Toolkit slice for managing listings state
const listings = createSlice({
  name: "listings",
  initialState,
  reducers: {
    emptySearches: (state) => {
      state.searched = null;
    },
  },
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
        console.log("fetching searched listings rejected");
      })
      .addCase(fetchListingsByCategory.pending, (state) => {
        console.log("fetching all listings");
      })
      .addCase(fetchListingsByCategory.fulfilled, (state, { payload }) => {
        console.log("fetching all listings fulfilled");
        state.listingsByCategory = payload;
      })
      .addCase(fetchListingsByCategory.rejected, (state) => {
        console.log("fetching searched listings rejected");
      })
      .addCase(fetchSearchListings.pending, (state) => {
        console.log("fetching searched listings");
      })
      .addCase(fetchSearchListings.fulfilled, (state, { payload }) => {
        console.log("fetching searched listings fulfilled");
        state.searched = payload;
      })
      .addCase(fetchSearchListings.rejected, (state) => {
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
      })
      .addCase(fetchBids.pending, (state) => {
        console.log("fetching bids");
      })
      .addCase(fetchBids.fulfilled, (state, { payload }) => {
        console.log("fetching bids fulfilled");
        state.bids = payload;
      })
      .addCase(fetchBids.rejected, (state) => {
        console.log("fetching bids rejected");
      })
      .addCase(fetchLocations.pending, (state) => {
        console.log("fetching locations");
      })
      .addCase(fetchLocations.fulfilled, (state, { payload }) => {
        console.log("fetching locations fulfilled");
        state.locations = payload;
      })
      .addCase(fetchLocations.rejected, (state) => {
        console.log("fetching locations rejected");
      })
      .addCase(fetchFavourites.pending, (state) => {
        console.log("fetching favourites");
      })
      .addCase(fetchFavourites.fulfilled, (state, { payload }) => {
        console.log("fetching favourites fulfilled");
        state.favourites = payload;
      })
      .addCase(fetchFavourites.rejected, (state) => {
        console.log("fetching favourites rejected");
      });
  },
});

// Export the listings reducer
export default listings.reducer;

// Selectors to get specific parts of the listings state
export const getAllListings = (state) => state.listings.listings;
export const getSearchedListing = (state) => state.listings.searched;
export const getListingByCategory = (state) => {
  return state?.listings?.listingsByCategory;
};
export const getAllCategories = (state) => state.listings.categories;
export const getUserListings = (state) => state.listings.userListings;
export const getBids = (state) => state.listings.bids;
export const getLocations = (state) => state.listings.locations;
export const getFavourites = (state) => state.listings.favourites;

export const { emptySearches } = listings.actions;
