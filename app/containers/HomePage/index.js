/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import routes from 'constants/routes.json';
import { logoutAction } from 'redux/actions/auth';

export function HomePage({ history, user, handleLogout }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Ecom Freedom Homepage test</h1>
      {!user.status ? (
        <Button variant="contained" color="primary" onClick={() => history.push(routes.LOGIN)}>
        Login
      </Button>
      ) : null
      }
      {user.status ? (
        <Button variant="contained" color="primary" onClick={() => history.push(routes.ADMIN)} style={{ marginLeft: 16 }}>
          Admin
        </Button>
      ) : null
      }
      {user.status ? (
        <Button variant="contained" color="primary" onClick={() => handleLogout()} style={{ marginLeft: 16 }}>
          Logout
        </Button>
      ) : null
      }
    </div>
  );
}

HomePage.propTypes = {
  handleLogout: PropTypes.func,
  history: PropTypes.object,
  user: PropTypes.object
};

const mapStateToProps = ({ auth }) => ({
  user: auth.user
});

const mapDispatchToProps = dispatch => ({
  handleLogout: () => {
    dispatch(logoutAction());
  }
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
  withRouter,
  memo
)(HomePage);
