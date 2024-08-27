import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  fetchAllPlacesStart,
  fetchAllPlacesSuccess,
  fetchAllPlacesFailure,
  fetchPlaceStart,
  fetchPlaceSuccess,
  fetchPlaceFailure,
} from "../slices/placeSlice";
import {
  GetAllPlacesWithImagesResponse,
  GetPlaceWithImagesResponse,
  PlaceWithImages,
} from "../../types/placesApiResponse";

const api = axios.create({
  baseURL: "http://localhost:5001/",
  withCredentials: true,
});

function* fetchAllPlacesSaga() {
  try {
    const response: PlaceWithImages = yield call(api.get, "places");
    yield put(fetchAllPlacesSuccess(response));
  } catch (error: any) {
    yield put(fetchAllPlacesFailure("Failed to fetch places with images"));
  }
}

function* fetchPlaceSaga(action: ReturnType<typeof fetchPlaceStart>) {
  try {
    const response: GetPlaceWithImagesResponse = yield call(
      api.get,
      `/places/${action.payload}`
    );
    yield put(fetchPlaceSuccess(response));
  } catch (error: any) {
    yield put(fetchPlaceFailure("Failed to fetch place with images"));
  }
}

export function* placeSaga() {
  yield takeLatest(fetchAllPlacesStart.type, fetchAllPlacesSaga);
  yield takeLatest(fetchPlaceStart.type, fetchPlaceSaga);
}
