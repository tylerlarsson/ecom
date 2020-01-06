import { fork } from 'redux-saga/effects';
import watchAuthListener from './auth';
import watchUsersListener from './users';
import watchCoursesListener from './courses';
import watchFilesListener from './files';

export default function* rootSaga() {
  yield fork(watchAuthListener);
  yield fork(watchUsersListener);
  yield fork(watchCoursesListener);
  yield fork(watchFilesListener);
}
