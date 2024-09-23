import { all } from "redux-saga/effects";
import authSaga from "./sagas/authSaga";
import searchSaga from "./sagas/searchSaga";
import { placeSaga } from "./sagas/placeSaga";
import { userSaga } from "./sagas/userSaga";
import tagSaga from "./sagas/tagSaga"
import heritageSaga from './sagas/heritageSaga'
import { hotelSaga } from "./sagas/hotelSaga";

export default function* rootSaga() {
  yield all([
    authSaga(),
    searchSaga(),
    placeSaga(),
    userSaga(),
    tagSaga(),
    heritageSaga(),
    hotelSaga()
  ]);
}
