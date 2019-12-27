import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { CssBaseline, Typography, Container, Box } from '@material-ui/core';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Button from 'components/Button/Button';
import routes from 'constants/routes.json';
import styles from './styles';

class ForgotPasswordForm extends Component {
  handleSubmit = event => {
    const { onSubmit } = this.props;
    event.preventDefault();

    onSubmit();
  };

  render() {
    const { classes } = this.props;

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div>
          <div className={classes.subtitle} style={{ marginBottom: 21 }}>
            RELAX, TAKE A BREATH, WE GOT YOU COVERED.
          </div>
          <Typography component="h1" variant="h5" className={classes.title}>
            Password Sent
          </Typography>
          <Typography className={classes.description} style={{ marginTop: 20 }}>
            <Box mt={1} mb={1}>
              We have sent you a link to change your password to your email. You should receiving it shortly.
            </Box>

            <Box mt={1}>
              <b>Please be certain to check your junk or spam folder.</b>
            </Box>
          </Typography>
          <div className={classes.divider} style={{ marginTop: 40 }} />
          <div className={classes.actionsCenter} style={{ marginTop: 20 }}>
            <Button type="submit" onClick={this.handleSubmit}>
              Send Again
            </Button>
          </div>
          <div className={classes.actionsCenter} style={{ marginTop: 20 }}>
            <Link to={routes.FORGOT_PASSWORD}>Try another Email Address</Link>
          </div>
        </div>
      </Container>
    );
  }
}

ForgotPasswordForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  classes: PropTypes.object
};
export default withRouter(connect()(withStyles(styles)(ForgotPasswordForm)));
