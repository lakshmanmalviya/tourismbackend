import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import placeReducer from "./slices/placeSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  place: placeReducer,
});
