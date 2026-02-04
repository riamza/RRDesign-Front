import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async () => {
    // The api interceptor should handle the token attachment
    const profile = await api.auth.getProfile();
    return profile; 
  },
  {
    condition: (_, { getState }) => {
      const { auth } = getState();
      // If we already have user data, don't refetch automatically
      // This implements "static data" caching
      if (auth.user && auth.status === 'succeeded') return false;
      if (auth.status === 'loading') return false;
      return true;
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null, // This effectively caches the /me response
    status: 'idle',
    error: null
  },
  reducers: {
    setUserData: (state, action) => {
      state.user = action.payload;
      state.status = 'succeeded';
    },
    clearUserData: (state) => {
      state.user = null;
      state.status = 'idle';
    },
    invalidateUserCache: (state) => {
        state.status = 'idle';
        // We might want to keep the user data until new data arrives to avoid flicker?
        // But for invalidation, clearing is safer to force update.
        state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setUserData, clearUserData, invalidateUserCache } = authSlice.actions;
export default authSlice.reducer;
