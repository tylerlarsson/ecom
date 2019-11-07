/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';

import HomePage from 'containers/HomePage/Loadable';
import ProfilePage from 'containers/ProfilePage';
import NotFoundPage from 'containers/NotFoundPage/Loadable';

import GlobalStyle from '../../global-styles';
import RequireAuth from 'components/RequireAuth';
import LoginPage from '../LoginPage/LoginPage';
import SignupPage from '../SignupPage/SignupPage';
import AdminPage from '../AdminPage';
import RequireNoAuth from 'components/RequireNoAuth';

export default function App() {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={RequireAuth(HomePage)} />
        <Route exact path="/login" component={RequireNoAuth(LoginPage)} />
        <Route exact path="/signup" component={RequireNoAuth(SignupPage)} />
        <Route path="/admin" component={RequireAuth(AdminPage)} />
        <Route exact path="/profile" component={RequireAuth(ProfilePage)} />
        <Route component={NotFoundPage} />
      </Switch>
      <GlobalStyle />
    </div>
  );
}
