import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  role: "admin",
};

const userSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload;
    },
  },
});

export const { setRole } = userSlice.actions;
export default userSlice.reducer;
