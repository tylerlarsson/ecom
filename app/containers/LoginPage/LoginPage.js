import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import LoginForm from '../../components/LoginForm';
import { tryToLogin } from '../../redux/actions/auth';

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
    alignItems: 'center'
  },
  title: {
    marginLeft: 50,
    fontSize: 47,
    fontWeight: 'bold',
    letterSpacing: '0.05em',
    color: theme.palette.secondary.main
  }
});

class LoginPage extends Component {
  render() {
    const { classes, onSubmit } = this.props;

    return (
      <div className={classes.root}>
        <Grid container spacing={0} className={classes.wrapper}>
          <Grid item xs={12} className={classes.column}>
            <LoginForm onSubmit={onSubmit} />
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  onSubmit: ({ email, password }) => {
    dispatch(tryToLogin(email, password));
  }
});

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(LoginPage));
