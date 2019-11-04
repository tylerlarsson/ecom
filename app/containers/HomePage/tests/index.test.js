import React from 'react';
import { render } from 'react-testing-library';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';

import history from 'utils/history';
import HomePage from '../index';

const mockStore = configureMockStore();
const store = mockStore({});

describe('<HomePage />', () => {
  it('should render and match the snapshot', () => {
    const {
      container: { firstChild }
    } = render(
      <Provider store={store}>
        <BrowserRouter history={history}>
          <HomePage />
        </BrowserRouter>
      </Provider>
    );
    expect(firstChild).toMatchSnapshot();
  });
});
