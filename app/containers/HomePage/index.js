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
import { createStructuredSelector } from 'reselect';
import Button from '@material-ui/core/Button';
import routes from 'constants/routes.json';

export function HomePage({ history }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Ecom Freedom Homepage test</h1>
      <Button variant="contained" color="primary" onClick={() => history.push(routes.LOGIN)}>
        Login
      </Button>
    </div>
  );
}

HomePage.propTypes = {
  history: PropTypes.object
};

const mapStateToProps = createStructuredSelector({});

const withConnect = connect(mapStateToProps);

export default compose(
  withConnect,
  withRouter,
  memo
)(HomePage);
