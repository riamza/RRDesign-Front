import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const fetchClientProjects = createAsyncThunk(
  'clientProjects/fetchClientProjects',
  async () => {
    const data = await api.getClientProjects();
    return data;
  },
  {
    condition: (_, { getState }) => {
      const { clientProjects } = getState();
      if (clientProjects.status === 'loading') return false;
      
      const now = Date.now();
      if (clientProjects.lastFetched && (now - clientProjects.lastFetched < CACHE_DURATION)) {
        return false;
      }
      return true;
    }
  }
);

const clientProjectsSlice = createSlice({
  name: 'clientProjects',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    lastFetched: null
  },
  reducers: {
    invalidateClientProjects: (state) => {
      state.lastFetched = null;
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClientProjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClientProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchClientProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { invalidateClientProjects } = clientProjectsSlice.actions;
export default clientProjectsSlice.reducer;
