import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import ChangePasswordSuccessForm from 'components/Auth/ChangePasswordSuccessForm';
import { signInAction } from 'redux/actions/auth';
import Bg from 'assets/img/forgot-bg.jpg';
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

class ChangePasswordSuccess extends PureComponent {
  onSubmit = password => {
    // TODO send request
    console.log('onSubmit', password);
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container spacing={0} className={classes.wrapper}>
          <Grid item xs={6} className={classes.column}>
            <AuthHeader />
            <ChangePasswordSuccessForm onSubmit={this.onSubmit} />
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
  onSubmit: ({ email, password }) => {
    dispatch(signInAction(email, password));
  }
});

ChangePasswordSuccess.propTypes = {
  classes: PropTypes.object
};

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(withStyles(styles)(ChangePasswordSuccess))
);
