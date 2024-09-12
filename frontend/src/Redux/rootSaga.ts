import { all } from "redux-saga/effects";
import authSaga from "./sagas/authSaga";
import { placeSaga } from "./sagas/placeSaga";
import searchSaga from "./sagas/searchSaga";

export default function* rootSaga() {
  yield all([authSaga(), placeSaga(), searchSaga()]);
}
