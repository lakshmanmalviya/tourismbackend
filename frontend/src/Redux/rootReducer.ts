import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import placeReducer from "./slices/placeSlice";
import searchReducer from "./slices/searchSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  place: placeReducer,
  search: searchReducer
});
