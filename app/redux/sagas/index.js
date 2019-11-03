import { fork } from 'redux-saga/effects';
import watchAuthListener from './auth';

export default function* rootSaga(context = {}) {
  yield fork(watchAuthListener, context);
}
