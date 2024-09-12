import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SearchQueryDto, SearchAllResponse, SearchHeritagesResponse, SearchHotelsResponse, SearchSuccessPayload } from '../../types/search/searchPayload';
import { EntityType } from '@/types/search/searchPayload';

interface SearchState {
  loading: boolean;
  error: string | null;
  ALL: {
    query: SearchQueryDto;
    results: SearchAllResponse | null;
  };
  HERITAGE: {
    query: SearchQueryDto;
    results: SearchHeritagesResponse | null;
  };
  HOTEL: {
    query: SearchQueryDto;
    results: SearchHotelsResponse | null;
  }
}

const initialState: SearchState = {
  loading: false,
  error: null,
  ALL: {
    query: {
      entityType: EntityType.ALL
    },
    results: null
  },
  HERITAGE: {
    query: {
      entityType: EntityType.HERITAGE
    },
    results: null
  },
  HOTEL: {
    query: {
      entityType: EntityType.HOTEL
    },
    results: null
  }
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    searchRequest(state, action: PayloadAction<SearchQueryDto>) {
      console.log("calling searchRequest.....");
      state.loading = true;
      state.error = null;
      state[action.payload.entityType].query = action.payload;
    },
    searchSuccess(state, action: PayloadAction<SearchSuccessPayload>) {
      state.loading = false;
      state[action.payload.entityType].results = action.payload.results;
    },
    searchFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { searchRequest, searchSuccess, searchFailure } = searchSlice.actions;
export default searchSlice.reducer;