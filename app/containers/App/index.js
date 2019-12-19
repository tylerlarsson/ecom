/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import HomePage from 'containers/HomePage/Loadable';
import ProfilePage from 'containers/Admin/ProfilePage';
import NotFoundPage from 'containers/NotFoundPage/Loadable';

import RequireAuth from 'components/RequireAuth';
import RequireNoAuth from 'components/RequireNoAuth';
import { getRoles, getPermissions } from 'redux/actions/users';
import routes from 'constants/routes.json';
import GlobalStyle from '../../global-styles';
import LoginPage from '../LoginPage/LoginPage';
import SignupPage from '../SignupPage/SignupPage';
import AdminPage from '../Admin';
import Course from '../Courses/Course';
import Lecture from '../Lecture/Lecture';

class App extends Component {
  componentWillMount() {
    const { getRolesAction, getPermissionsAction } = this.props;

    getRolesAction();
    getPermissionsAction();
  }

  render() {
    return (
      <div>
        <Switch>
          <Route exact path={routes.HOME} component={RequireAuth(HomePage)} />
          <Route exact path={routes.LOGIN} component={RequireNoAuth(LoginPage)} />
          <Route exact path={routes.SIGNUP} component={RequireNoAuth(SignupPage)} />
          <Route path={routes.ADMIN} component={RequireAuth(AdminPage)} />
          <Route exact path={routes.COURSES_ENROLLED} component={RequireAuth(Course)} />
          <Route exact path={routes.LECTURE} component={RequireAuth(Lecture)} />
          <Route exact path={routes.PROFILE} component={RequireAuth(ProfilePage)} />
          <Route component={NotFoundPage} />
        </Switch>
        <GlobalStyle />
      </div>
    );
  }
}

App.propTypes = {
  getRolesAction: PropTypes.func.isRequired,
  getPermissionsAction: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  getRolesAction: name => {
    dispatch(getRoles(name));
  },
  getPermissionsAction: () => {
    dispatch(getPermissions());
  }
});

export default connect(
  null,
  mapDispatchToProps
)(App);
