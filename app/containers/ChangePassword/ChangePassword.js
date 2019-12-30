import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import qs from 'query-string';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import ChangePasswordForm from 'components/Auth/ChangePasswordForm';
import { resetPasswordAction } from 'redux/actions/auth';
import Bg from 'assets/img/forgot-bg.jpg';
import AuthHeader from 'components/Auth/AuthHeader';
import AuthFooter from 'components/Auth/AuthFooter';
import AuthReview from 'components/Auth/AuthReview';
import Reviewer from 'assets/img/faces/oval.jpg';
import { RESET_PASSWORD_ID_PARAM } from 'constants/default';
import routes from 'constants/routes.json';

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  wrapper: {
    flex: 1,
    display: 'flex'
  },
  column: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  columnRight: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: `url(${Bg}) no-repeat left top`,
    backgroundSize: 'cover',
    position: 'relative'
  },
  title: {
    marginLeft: 50,
    fontSize: 47,
    fontWeight: 'bold',
    letterSpacing: '0.05em',
    color: theme.palette.secondary.main
  }
});

class ChangePassword extends PureComponent {
  state = {
    id: false
  }

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
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container spacing={0} className={classes.wrapper}>
          <Grid item xs={6} className={classes.column}>
            <AuthHeader />
            <ChangePasswordForm onSubmit={this.onSubmit} />
            <AuthFooter />
          </Grid>
          <Grid item xs={6} className={classes.columnRight}>
            <AuthReview
              text="The road to success is littered with potholes.Try to enjoy the bumpy ride!"
              reviewer={{
                avatar: Reviewer,
                name: 'Harry Holder',
                username: '@harryholder'
              }}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  resetPassword: password => {
    dispatch(resetPasswordAction(password));
  }
});

ChangePassword.propTypes = {
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  classes: PropTypes.object,
  resetPassword: PropTypes.func.isRequired
};

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(withStyles(styles)(ChangePassword))
);
