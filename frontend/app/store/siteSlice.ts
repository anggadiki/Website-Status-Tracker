import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface Site {
  id: string;
  url: string;
  name: string;
}

interface SiteState {
  sites: Site[];
  loading: boolean;
}

const initialState: SiteState = {
  sites: [],
  loading: false,
};

export const fetchSites = createAsyncThunk("site/fetchSites", async () => {
  const res = await fetch(
    "https://website-status-tracker-production.up.railway.app/api/sites"
  );
  return await res.json();
});

const siteSlice = createSlice({
  name: "site",
  initialState,
  reducers: {
    addSite(state, action) {
      state.sites.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSites.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSites.fulfilled, (state, action) => {
        state.loading = false;
        state.sites = action.payload;
      })
      .addCase(fetchSites.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { addSite } = siteSlice.actions;
export default siteSlice.reducer;
