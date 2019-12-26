import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { CssBaseline, FormControl, Typography, Container, TextField, InputAdornment } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Button from 'components/Button/Button';
import { EmailOutlined } from '@material-ui/icons';
import EmailIcon from 'assets/img/email-icon.svg';
import styles from './styles';

class ForgotPasswordForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: ''
    };
  }

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  validate = () => {
    const { email } = this.state;

    if (!email.trim()) {
      return false;
    }

    return true;
  };

  handleSubmit = event => {
    const { email } = this.state;
    const { onSubmit } = this.props;
    event.preventDefault();

    if (this.validate()) {
      onSubmit({ email });
    }
  };

  render() {
    const { classes, login } = this.props;
    const { email } = this.state;

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <div className={classes.subtitle} style={{ marginBottom: 21 }}>
            RELAX, TAKE A BREATH, WE GOT YOU COVERED.
          </div>
          <Typography component="h1" variant="h5" className={classes.title} style={{ marginBottom: 15 }}>
            Password Retrieval
          </Typography>
          <form className={classes.form}>
            <FormControl fullWidth className={classes.margin} error={login && login.failed}>
              <div className={classes.label}>Email</div>
              <TextField
                required
                fullWidth
                variant="outlined"
                id="email"
                name="email"
                autoComplete="email"
                value={email || ''}
                onChange={this.handleChange('email')}
                autoFocus
                classes={{ root: classes.input }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined className={classes.icon} />
                    </InputAdornment>
                  )
                }}
              />
            </FormControl>
            <div className={classes.description} style={{ marginTop: 20, textAlign: 'center' }}>
              Please type in the email associated with your account.
            </div>
            <div className={classes.divider} style={{ marginTop: 40 }} />
            <div className={classes.actionsCenter} style={{ marginTop: 20 }}>
              <Button type="submit" onClick={this.handleSubmit}>
                Send Link
              </Button>
            </div>
          </form>
        </div>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  const { login } = state;
  return { login };
}

ForgotPasswordForm.defaultProps = {
  onCheckChange: () => {}
};

ForgotPasswordForm.propTypes = {
  onCheckChange: PropTypes.func,
  checked: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  login: PropTypes.object,
  classes: PropTypes.object
};
export default withRouter(connect(mapStateToProps)(withStyles(styles)(ForgotPasswordForm)));
