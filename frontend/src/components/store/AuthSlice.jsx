// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  loading: false,
  //user: localStorage.user || null ,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoggedIn(state,action) {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    setLoggedOut(state) {
      state.isLoggedIn = false;
      state.user = null;
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },
  },
});

export const { setLoggedIn, setLoggedOut, setLoading } = authSlice.actions;
export default authSlice.reducer;
