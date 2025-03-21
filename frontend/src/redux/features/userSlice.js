import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  profile: null,
  loading: false,
  error: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserError: (state, action) => {
      state.error = action.payload
    },
    setUserProfile: (state, action) => {
      state.profile = action.payload;
    }
  }
});

export const {
  setUserError,
  setUserProfile,
} = userSlice.actions;

export default userSlice.reducer;