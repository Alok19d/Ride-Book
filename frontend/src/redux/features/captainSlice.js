import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  profile: null,
  loading: false,
  error: null
}

const captainSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCaptainError: (state, action) => {
      state.error = action.payload
    },
    setCaptainProfile: (state, action) => {
      state.profile = action.payload;
    }
  }
});

export const {
  setCaptainError,
  setCaptainProfile,
} = captainSlice.actions;

export default captainSlice.reducer;