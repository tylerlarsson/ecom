import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ResendPasswordForm from 'components/Auth/ResendPasswordForm';
import { signInAction } from 'redux/actions/auth';
import Bg from 'assets/img/forgot-bg.jpg';
import Reviewer from 'assets/img/faces/oval.jpg';
import routes from 'constants/routes.json';
import AuthLayout from 'components/Auth/AuthLayout';

class ResendPassword extends PureComponent {
  onSubmit = () => {
    const { history } = this.props;
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
        <ResendPasswordForm onSubmit={this.onSubmit} />
      </AuthLayout>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  onSubmit: ({ email, password }) => {
    dispatch(signInAction(email, password));
  }
});

ResendPassword.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired
};

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(ResendPassword)
);
