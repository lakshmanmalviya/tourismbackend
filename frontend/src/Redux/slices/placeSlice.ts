import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  GetPlaceWithImagesResponse,
  PlaceWithImages,
} from "../../types/placesApiResponse";

interface PlaceState {
  places: PlaceWithImages | null;
  place: PlaceWithImages | null;
  loading: boolean;
  error: string | null;
}

const initialState: PlaceState = {
  places: null,
  place: null,
  loading: false,
  error: null,
};

const placeSlice = createSlice({
  name: "place",
  initialState,
  reducers: {
    fetchAllPlacesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchAllPlacesSuccess(state, action: PayloadAction<PlaceWithImages>) {
      state.loading = false;
      state.places = action.payload;
    },
    fetchAllPlacesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchPlaceStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchPlaceSuccess(
      state,
      action: PayloadAction<GetPlaceWithImagesResponse>
    ) {
      state.loading = false;
      state.place = action.payload.data;
    },
    fetchPlaceFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchAllPlacesStart,
  fetchAllPlacesSuccess,
  fetchAllPlacesFailure,
  fetchPlaceStart,
  fetchPlaceSuccess,
  fetchPlaceFailure,
} = placeSlice.actions;

export default placeSlice.reducer;
