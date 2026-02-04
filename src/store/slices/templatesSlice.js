import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const fetchTemplates = createAsyncThunk(
  'templates/fetchTemplates',
  async () => {
    const data = await api.getTemplates();
    return data;
  },
  {
    condition: (_, { getState }) => {
      const { templates } = getState();
      if (templates.status === 'loading') return false;
      
      const now = Date.now();
      if (templates.lastFetched && (now - templates.lastFetched < CACHE_DURATION)) {
        return false;
      }
      return true;
    }
  }
);

const templatesSlice = createSlice({
  name: 'templates',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    lastFetched: null
  },
  reducers: {
    invalidateTemplates: (state) => {
      state.lastFetched = null;
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTemplates.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { invalidateTemplates } = templatesSlice.actions;
export default templatesSlice.reducer;
