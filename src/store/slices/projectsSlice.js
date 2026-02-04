import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async () => {
    const data = await api.getProjects();
    return data;
  },
  {
    condition: (_, { getState }) => {
      const { projects } = getState();
      if (projects.status === 'loading') return false;
      
      const now = Date.now();
      if (projects.lastFetched && (now - projects.lastFetched < CACHE_DURATION)) {
        return false;
      }
      return true;
    }
  }
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    lastFetched: null
  },
  reducers: {
    invalidateProjects: (state) => {
      state.lastFetched = null;
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { invalidateProjects } = projectsSlice.actions;
export default projectsSlice.reducer;
