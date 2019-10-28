import React, { Component } from 'react';

import { connect } from 'react-redux';

export default function (ComposedComponent) {
  class Authentication extends Component {
    componentWillMount() {
      if (!localStorage.getItem('user_id')) {
        this.props.history.push('/login');
      }
    }

    render() {
      return (<ComposedComponent {...this.props} />);
    }
  }
  return connect()(Authentication);
}
