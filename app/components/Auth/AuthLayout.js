import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Bg from 'assets/img/login-bg.jpg';
import AuthHeader from 'components/Auth/AuthHeader';
import AuthFooter from 'components/Auth/AuthFooter';
import AuthReview from 'components/Auth/AuthReview';
import Reviewer from 'assets/img/faces/oval.jpg';

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

class AuthLayout extends PureComponent {
  render() {
    const { classes, children, review } = this.props;

    return (
      <div className={classes.root}>
        <Grid container spacing={0} className={classes.wrapper}>
          <Grid item xs={6} className={classes.column}>
            <AuthHeader />
            {children}
            <AuthFooter />
          </Grid>
          <Grid item xs={6} className={classes.columnRight}>
            {review ? <AuthReview {...review} /> : null}
          </Grid>
        </Grid>
      </div>
    );
  }
}

AuthLayout.propTypes = {
  review: PropTypes.objectOf(PropTypes.any),
  children: PropTypes.objectOf(PropTypes.any),
  classes: PropTypes.objectOf(PropTypes.any)
};

export default withStyles(styles)(AuthLayout);
