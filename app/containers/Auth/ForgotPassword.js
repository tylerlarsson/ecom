import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ForgotPasswordForm from 'components/Auth/ForgotPasswordForm';
import { forgotPasswordAction } from 'redux/actions/auth';
import Bg from 'assets/img/forgot-bg.jpg';
import Reviewer from 'assets/img/faces/oval.jpg';
import routes from 'constants/routes.json';
import AuthLayout from 'components/Auth/AuthLayout';

class ForgotPassword extends PureComponent {
  onSubmit = data => {
    const { history, forgotPassword } = this.props;
    forgotPassword(data);
    history.push(routes.RESEND_PASSWORD);
  };

  render() {
    return (
      <AuthLayout
        bg={Bg}
        review={{
          text: 'The road to success is littered with potholes.Try to enjoy the bumpy ride!',
          avatar: Reviewer,
          name: 'Harry Holder',
          username: '@harryholder'
        }}
      >
        <ForgotPasswordForm onSubmit={this.onSubmit} />
      </AuthLayout>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  forgotPassword: data => {
    dispatch(forgotPasswordAction(data));
  }
});

ForgotPassword.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  forgotPassword: PropTypes.func.isRequired
};

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(ForgotPassword)
);
