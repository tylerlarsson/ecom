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
import ProfilePage from 'containers/ProfilePage';
import NotFoundPage from 'containers/NotFoundPage/Loadable';

import RequireAuth from 'components/RequireAuth';
import RequireNoAuth from 'components/RequireNoAuth';
import GlobalStyle from '../../global-styles';
import LoginPage from '../LoginPage/LoginPage';
import SignupPage from '../SignupPage/SignupPage';
import AdminPage from '../AdminPage';
import { getRoles, getPermissions } from 'redux/actions/users';

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
