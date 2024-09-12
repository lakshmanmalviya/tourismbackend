import { call, put, takeLatest } from 'redux-saga/effects';
import { searchRequest, searchSuccess, searchFailure } from '../slices/searchSlice';
import { SearchQueryDto, SearchAllResponse } from '../../types/search/searchPayload';
import { api } from '@/utils/utils';

async function searchApi(query: SearchQueryDto): Promise<SearchAllResponse> {
    const response = await api.get('/search', { params: query });
    return response.data;
}

function* handleSearch(action: ReturnType<typeof searchRequest>) {
  try {console.log( " handlesearch has been called ...")
    const data : SearchAllResponse  = yield call(searchApi, action.payload);
    yield put(searchSuccess({results: data, entityType: action.payload.entityType}));

    console.log( " search result after api call " , data)
  } catch (error: any) {
    yield put(searchFailure(error.response?.data?.message || 'Search failed'));
  }
}

export default function* searchSaga() {
  yield takeLatest(searchRequest.type, handleSearch);
}