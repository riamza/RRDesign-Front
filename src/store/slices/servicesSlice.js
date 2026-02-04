import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async () => {
    const data = await api.getServices();
    return data;
  },
  {
    condition: (_, { getState }) => {
      const { services } = getState();
      if (services.status === 'loading') return false;
      
      const now = Date.now();
      if (services.lastFetched && (now - services.lastFetched < CACHE_DURATION)) {
        return false;
      }
      return true;
    }
  }
);

const servicesSlice = createSlice({
  name: 'services',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    lastFetched: null
  },
  reducers: {
    invalidateServices: (state) => {
      state.lastFetched = null;
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { invalidateServices } = servicesSlice.actions;
export default servicesSlice.reducer;
