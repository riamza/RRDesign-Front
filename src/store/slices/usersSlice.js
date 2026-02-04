import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { getState }) => {
    const { lastFetch } = getState().users;
    if (lastFetch && Date.now() - lastFetch < CACHE_DURATION) {
      return null;
    }
    return await api.users.getAll();
  }
);

export const toggleUserStatus = createAsyncThunk(
  'users/toggleStatus',
  async ({ id, status }, { dispatch }) => {
    await api.users.toggleStatus(id, status);
    dispatch(invalidateUsers());
    return { id, status };
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    items: [],
    status: 'idle',
    lastFetch: null,
    error: null
  },
  reducers: {
    invalidateUsers: (state) => {
      state.lastFetch = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        if (!state.lastFetch) state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          state.items = action.payload;
          state.lastFetch = Date.now();
        }
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { invalidateUsers } = usersSlice.actions;
export default usersSlice.reducer;
