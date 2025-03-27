import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  content: "<p>Start writing your letter...</p>",
};

const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    setContent: (state, action) => {
      state.content = action.payload;
    },
  },
});

export const { setContent } = editorSlice.actions;
export default editorSlice.reducer;
