import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import SignupForm from 'components/Auth/SignupForm';
import { signUpAction } from 'redux/actions/auth';
import { connect } from 'react-redux';
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

class SignupPage extends PureComponent {
  render() {
    const { classes, onSubmit } = this.props;

    return (
      <div className={classes.root}>
        <Grid container spacing={0} className={classes.wrapper}>
          <Grid item xs={6} className={classes.column}>
            <AuthHeader />
            <SignupForm onSubmit={onSubmit} />
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
  onSubmit: data => {
    dispatch(signUpAction(data));
  }
});

SignupPage.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  classes: PropTypes.object
};

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(SignupPage));
