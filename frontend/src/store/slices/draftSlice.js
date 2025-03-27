import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  drafts: JSON.parse(localStorage.getItem("drafts")) || [],
};

const draftSlice = createSlice({
  name: "drafts",
  initialState,
  reducers: {
    loadDrafts: (state) => {
      state.drafts = JSON.parse(localStorage.getItem("drafts")) || [];
    },
    saveDraft: (state, action) => {
      const { id, title, content, isUpdate } = action.payload;

      if (isUpdate) {
        // Update existing draft
        state.drafts = state.drafts.map((draft) =>
          draft.id === id
            ? { ...draft, title, content, date: new Date().toLocaleString() }
            : draft
        );
      } else {
        // Create new draft
        const newDraft = {
          id: Date.now(),
          title,
          content,
          date: new Date().toLocaleString(),
        };
        state.drafts.push(newDraft);
      }

      localStorage.setItem("drafts", JSON.stringify(state.drafts)); // Save to localStorage
    },
    deleteDraft: (state, action) => {
      state.drafts = state.drafts.filter(
        (draft) => draft.id !== action.payload
      );
      localStorage.setItem("drafts", JSON.stringify(state.drafts)); // Update storage
    },
  },
});

export const { loadDrafts, saveDraft, deleteDraft } = draftSlice.actions;
export default draftSlice.reducer;
