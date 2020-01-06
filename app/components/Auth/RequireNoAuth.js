import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setUserAction } from 'redux/actions/auth';

export default function(ComposedComponent) {
  class Authentication extends Component {
    propTypes = {
      history: PropTypes.objectOf(PropTypes.any).isRequired,
      setUser: PropTypes.func.isRequired
    };

    componentWillMount() {
      const accessToken = localStorage.getItem('authentication_token');
      if (accessToken) {
        this.props.setUser({ accessToken });
        this.props.history.push('/');
      }
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  return connect(
    null,
    dispatch => ({
      setUser: ({ email, password }) => {
        dispatch(setUserAction(email, password));
      }
    })
  )(Authentication);
}
