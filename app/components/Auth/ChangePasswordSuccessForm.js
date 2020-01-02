import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { CssBaseline, Typography, Container, Box } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Button from 'components/Button/Button';
import routes from 'constants/routes.json';
import styles from './styles';

class ChangePasswordSuccessForm extends Component {
  handleSubmit = event => {
    const { history } = this.props;
    event.preventDefault();

    history.push(routes.LOGIN);
  };

  render() {
    const { classes } = this.props;

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div>
          <div className={classes.subtitle} style={{ marginBottom: 21 }}>
            AWESOME, LET’S GET BACK ON TRACK.
          </div>
          <Typography component="h1" variant="h5" className={classes.title}>
            It’s a Success
          </Typography>
          <Typography className={classes.description} style={{ marginTop: 20 }}>
            <Box mt={1} mb={1}>
              Your password has been successfully changed, please keep it in a secure place to ensure safety of your
              information.
            </Box>

            <Box mt={3}>
              <b>Now, let’s make sure your new password is working. </b>
            </Box>
          </Typography>
          <div className={classes.divider} style={{ marginTop: 40 }} />
          <div className={classes.actionsCenter} style={{ marginTop: 20 }}>
            <Button type="submit" onClick={this.handleSubmit}>
              Go to Login
            </Button>
          </div>
        </div>
      </Container>
    );
  }
}

ChangePasswordSuccessForm.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  classes: PropTypes.object
};
export default withRouter(connect()(withStyles(styles)(ChangePasswordSuccessForm)));
