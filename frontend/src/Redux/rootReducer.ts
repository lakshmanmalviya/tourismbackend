import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import placeReducer from "./slices/placeSlice";
import searchReducer from "./slices/searchSlice";
import userReducer from "./slices/userSlice";
import tagReducer from './slices/tagSlice'
import heritageReducer from './slices/heritageSlice'

export const rootReducer = combineReducers({
  auth: authReducer,
  place: placeReducer,
  search: searchReducer,
  heritage: heritageReducer,
  user:userReducer,
  tag: tagReducer
});
