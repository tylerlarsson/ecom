import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import qs from 'query-string';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ChangePasswordForm from 'components/Auth/ChangePasswordForm';
import { resetPasswordAction } from 'redux/actions/auth';
import Bg from 'assets/img/forgot-bg.jpg';
import Reviewer from 'assets/img/faces/oval.jpg';
import { RESET_PASSWORD_ID_PARAM } from 'constants/default';
import routes from 'constants/routes.json';
import AuthLayout from 'components/Auth/AuthLayout';

class ChangePassword extends PureComponent {
  state = {
    id: false
  };

  componentDidMount() {
    this.setId();
  }

  setId = () => {
    const { location, history } = this.props;
    const id = qs.parse(location && location.search, { ignoreQueryPrefix: true })[RESET_PASSWORD_ID_PARAM];

    if (id) {
      this.setState({ id });
    } else {
      history.push(routes.FORGOT_PASSWORD);
    }
  };

  onSubmit = password => {
    const { id } = this.state;
    const { resetPassword } = this.props;

    const payload = {
      password,
      id
    };
    resetPassword(payload);
  };

  render() {
    const { error } = this.props;

    return (
      <AuthLayout
        error={error}
        bg={Bg}
        review={{
          text: 'The road to success is littered with potholes.Try to enjoy the bumpy ride!',
          avatar: Reviewer,
          name: 'Harry Holder',
          username: '@harryholder'
        }}
      >
        <ChangePasswordForm onSubmit={this.onSubmit} />
      </AuthLayout>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  error: auth.error
});

const mapDispatchToProps = dispatch => ({
  resetPassword: password => {
    dispatch(resetPasswordAction(password));
  }
});

ChangePassword.propTypes = {
  error: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  resetPassword: PropTypes.func.isRequired
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ChangePassword)
);
