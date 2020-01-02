import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Bg from 'assets/img/login-bg.jpg';
import AuthHeader from 'components/Auth/AuthHeader';
import AuthFooter from 'components/Auth/AuthFooter';
import AuthReview from 'components/Auth/AuthReview';
import Alert from 'assets/img/alert.png';

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
    flexDirection: 'column',
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
  },
  errorBox: {
    background: '#FFF0F0',
    border: '1px solid #931711',
    borderRadius: 4,
    padding: '12px 24px',
    width: 398,
    display: 'flex',
    marginBottom: 30
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '22px',
    color: '#931711',
    marginTop: 4
  },
  errorDescription: {
    fontSize: 12,
    lineHeight: '16px',
    color: '#4A4A4A',
    marginBottom: 4
  }
});

class AuthLayout extends PureComponent {
  render() {
    const { classes, children, review, error } = this.props;

    return (
      <div className={classes.root}>
        <Grid container spacing={0} className={classes.wrapper}>
          <Grid item xs={6} className={classes.column}>
            <AuthHeader />
            {error && (error.title || error.description) ? (
              <div className={classes.errorBox}>
                <img src={Alert} width={28} height={28} alt="" style={{ marginRight: 16 }} />
                <div>
                  <div className={classes.errorTitle}>{error.title}</div>
                  <div className={classes.errorDescription}>{error.description}</div>
                </div>
              </div>
            ) : null}
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
  error: PropTypes.objectOf(PropTypes.any),
  review: PropTypes.objectOf(PropTypes.any),
  children: PropTypes.objectOf(PropTypes.any),
  classes: PropTypes.objectOf(PropTypes.any)
};

export default withStyles(styles)(AuthLayout);
