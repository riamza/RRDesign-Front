import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const fetchPricing = createAsyncThunk(
  'pricing/fetchPricing',
  async () => {
    const data = await api.getPricing();
    return data;
  },
  {
    condition: (_, { getState }) => {
      const { pricing } = getState();
      if (pricing.status === 'loading') return false;
      
      const now = Date.now();
      if (pricing.lastFetched && (now - pricing.lastFetched < CACHE_DURATION)) {
        return false;
      }
      return true;
    }
  }
);

const pricingSlice = createSlice({
  name: 'pricing',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    lastFetched: null
  },
  reducers: {
    invalidatePricing: (state) => {
      state.lastFetched = null;
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPricing.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPricing.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchPricing.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { invalidatePricing } = pricingSlice.actions;
export default pricingSlice.reducer;
