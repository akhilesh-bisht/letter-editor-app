import { configureStore } from "@reduxjs/toolkit";
import draftReducer from "./slices/draftSlice";
import userReducer from "./slices/userSlice";
import editorReducer from "./slices/editorSlice";
export const store = configureStore({
  reducer: {
    drafts: draftReducer,
    user: userReducer,
    editor: editorReducer,
  },
});
