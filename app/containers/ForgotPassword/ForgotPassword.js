import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import LoginForm from 'components/Auth/LoginForm';
import { signInAction } from 'redux/actions/auth';
import Bg from 'assets/img/login-bg.jpg';
import AuthHeader from 'components/Auth/AuthHeader';
import AuthFooter from 'components/Auth/AuthFooter';

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

class ForgotPassword extends PureComponent {
  render() {
    const { classes, onSubmit } = this.props;

    return (
      <div className={classes.root}>
        <Grid container spacing={0} className={classes.wrapper}>
          <Grid item xs={6} className={classes.column}>
            <AuthHeader />
            <LoginForm onSubmit={onSubmit} />
            <AuthFooter />
          </Grid>
          <Grid item xs={6} className={classes.columnRight}>
            <div />
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  onSubmit: ({ email, password }) => {
    dispatch(signInAction(email, password));
  }
});

ForgotPassword.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  classes: PropTypes.object
};

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(withStyles(styles)(ForgotPassword))
);
