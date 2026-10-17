import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.BACK_API_URL;


const getErrorMessage = (error, fallback) => error.response?.data?.msg || error.response?.data?.message || fallback;

export const getWishlist = createAsyncThunk('wishlist/getWishlist', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${API_URL}/api/auth/wishlist`, { withCredentials: true });
    return data.wishlist || [];
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Could not load wishlist'));
  }
});

export const addToWishlist = createAsyncThunk('wishlist/add', async (productId, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${API_URL}/api/auth/wishlist/${productId}`, {}, { withCredentials: true });
    return { productId, wishlist: data.wishlist || [], message: data.msg || 'Added to wishlist' };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Could not add product to wishlist'));
  }
});

export const removeFromWishlist = createAsyncThunk('wishlist/remove', async (productId, { rejectWithValue }) => {
  try {
    const { data } = await axios.delete(`${API_URL}/api/auth/wishlist/${productId}`, { withCredentials: true });
    return { productId, wishlist: data.wishlist || [], message: data.msg || 'Removed from wishlist' };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Could not remove product from wishlist'));
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: [], loading: false, mutationLoading: false, error: null, message: null },
  reducers: {
    clearWishlistMessages: (state) => { state.error = null; state.message = null; },
    resetWishlist: (state) => { state.items = []; state.error = null; state.message = null; state.loading = false; state.mutationLoading = false; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWishlist.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getWishlist.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(getWishlist.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(addToWishlist.pending, (state) => { state.mutationLoading = true; state.error = null; state.message = null; })
      .addCase(addToWishlist.fulfilled, (state, action) => { state.mutationLoading = false; state.items = action.payload.wishlist; state.message = action.payload.message; })
      .addCase(addToWishlist.rejected, (state, action) => { state.mutationLoading = false; state.error = action.payload; })
      .addCase(removeFromWishlist.pending, (state) => { state.mutationLoading = true; state.error = null; state.message = null; })
      .addCase(removeFromWishlist.fulfilled, (state, action) => { state.mutationLoading = false; state.items = action.payload.wishlist; state.message = action.payload.message; })
      .addCase(removeFromWishlist.rejected, (state, action) => { state.mutationLoading = false; state.error = action.payload; });
  }
});

export const { clearWishlistMessages, resetWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
