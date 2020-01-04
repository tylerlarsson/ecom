import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setUserAction } from 'redux/actions/auth';

export default function (ComposedComponent) {
  class Authentication extends Component {
    constructor(props) {
      super(props);
    }

    componentWillMount() {
      const access_token = localStorage.getItem('authentication_token');
      if (!access_token) {
        this.props.history.push('/login');
      } else {
        this.props.setUser({ access_token })
      }
    }

    render() {
      return (<ComposedComponent {...this.props} />);
    }
  }

  return connect(null, (dispatch) => ({
    setUser: ({ email, password }) => {
      dispatch(setUserAction(email, password));
    }
  }))(Authentication);
}
