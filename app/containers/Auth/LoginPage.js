import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoginForm from 'components/Auth/LoginForm';
import { signInAction } from 'redux/actions/auth';
import Bg from 'assets/img/login-bg.jpg';
import Reviewer from 'assets/img/faces/oval.jpg';
import AuthLayout from 'components/Auth/AuthLayout';

class LoginPage extends PureComponent {
  render() {
    const { onSubmit } = this.props;

    return (
      <AuthLayout
        bg={Bg}
        review={{
          text: 'My shop is making $30000 a month while I relax in Sousa, Dominican Republic. Living the dream!',
          avatar: Reviewer,
          name: 'Harry Holder',
          username: '@harryholder'
        }}
      >
        <LoginForm onSubmit={onSubmit} />
      </AuthLayout>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  onSubmit: ({ email, password }) => {
    dispatch(signInAction(email, password));
  }
});

LoginPage.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default connect(
  null,
  mapDispatchToProps
)(LoginPage);
