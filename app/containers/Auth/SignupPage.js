import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SignupForm from 'components/Auth/SignupForm';
import { signUpAction } from 'redux/actions/auth';
import { connect } from 'react-redux';
import Bg from 'assets/img/login-bg.jpg';
import Reviewer from 'assets/img/faces/oval.jpg';
import AuthLayout from 'components/Auth/AuthLayout';

class SignupPage extends PureComponent {
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
        <SignupForm onSubmit={onSubmit} />
      </AuthLayout>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  onSubmit: data => {
    dispatch(signUpAction(data));
  }
});

SignupPage.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default connect(
  null,
  mapDispatchToProps
)(SignupPage);
