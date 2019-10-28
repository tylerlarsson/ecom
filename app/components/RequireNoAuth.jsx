import React, { Component } from 'react';

export default function (ComposedComponent) {
  class Authentication extends Component {
    componentWillMount() {
      if (localStorage.getItem('user_id')) {
        this.props.history.push('/');
      }
    }

    render() {
      return (<ComposedComponent {...this.props} />);
    }
  }
  return Authentication;
}
