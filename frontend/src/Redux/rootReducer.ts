import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import placeReducer from "./slices/placeSlice";
import searchReducer from "./slices/searchSlice";
import userReducer from "./slices/userSlice";
import tagReducer from './slices/tagSlice'

export const rootReducer = combineReducers({
  auth: authReducer,
  place: placeReducer,
  search: searchReducer,
  user:userReducer,
  tag: tagReducer
});
