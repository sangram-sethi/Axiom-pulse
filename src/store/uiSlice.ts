"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Density = "comfortable" | "compact";

interface PreferencesState {
  liveUpdatesEnabled: boolean;
  density: Density;
}

interface UiState {
  watchlist: string[];
  preferences: PreferencesState;
}

const initialState: UiState = {
  watchlist: [],
  preferences: {
    liveUpdatesEnabled: true,
    density: "comfortable",
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleWatchlist(state, action: PayloadAction<string>) {
      const id = action.payload;
      const idx = state.watchlist.indexOf(id);
      if (idx >= 0) {
        state.watchlist.splice(idx, 1);
      } else {
        state.watchlist.push(id);
      }
    },
    setLiveUpdatesEnabled(state, action: PayloadAction<boolean>) {
      state.preferences.liveUpdatesEnabled = action.payload;
    },
    setDensity(state, action: PayloadAction<Density>) {
      state.preferences.density = action.payload;
    },
  },
});

export const { toggleWatchlist, setLiveUpdatesEnabled, setDensity } =
  uiSlice.actions;

export default uiSlice.reducer;
