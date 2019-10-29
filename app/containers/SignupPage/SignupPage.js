import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import SignupForm from '../../components/SignupForm';

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundPosition: 'top right',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
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

class SignupPage extends Component {
  render() {
    const { classes } = this.props;

    console.log('classes', classes);
    return (
      <div className={classes.root}>
        <Grid container spacing={0} className={classes.wrapper}>
          <Grid item xs={12} className={classes.column}>
            <SignupForm />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(SignupPage);
