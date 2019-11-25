import { fork } from 'redux-saga/effects';
import watchAuthListener from './auth';
import watchUsersListener from './users';
import watchCoursesListener from './courses';

export default function* rootSaga(context = {}) {
  yield fork(watchAuthListener, context);
  yield fork(watchUsersListener, context);
  yield fork(watchCoursesListener, context);
}
