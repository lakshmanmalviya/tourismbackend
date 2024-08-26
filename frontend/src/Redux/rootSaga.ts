import { all } from "redux-saga/effects";
import authSaga from "./sagas/authSaga";
import { placeSaga } from "./sagas/placeSaga";

export default function* rootSaga() {
  yield all([authSaga(), placeSaga()]);
}
