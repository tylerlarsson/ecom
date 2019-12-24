import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  CssBaseline,
  FormControl,
  Typography,
  Container,
  TextField,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel
} from '@material-ui/core';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import routes from 'constants/routes.json';
import Button from 'components/Button/Button';
import { Email, VpnKey, Visibility, VisibilityOff } from '@material-ui/icons';
import EmailIcon from 'assets/img/email-icon.svg';
import KeyIcon from 'assets/img/key-icon.svg';
import styles from './styles';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      showPassword: false
    };
  }

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  validate = () => {
    const { email, password } = this.state;

    if (!email.trim() || !password) {
      return false;
    }

    return true;
  };

  handleSubmit = event => {
    const { email, password } = this.state;
    const { onSubmit } = this.props;
    event.preventDefault();

    if (this.validate()) {
      onSubmit({ email, password });
    }
  };

  handleRegister = event => {
    const { history } = this.props;
    event.preventDefault();

    history.push(routes.SIGNUP);
  };

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  handleMouseDownPassword = event => {
    event.preventDefault();
  };

  render() {
    const { classes, login, checked, onCheckChange } = this.props;
    const { email, password, showPassword } = this.state;

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <div className={classes.subtitle} style={{ marginBottom: 21 }}>
            START YOUR PATH TO FINANCIAL FREEDOM.
          </div>
          <Typography component="h1" variant="h5" className={classes.title} style={{ marginBottom: 15 }}>
            Log into You Account
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
                      <Email className={classes.icon} />
                    </InputAdornment>
                  )
                }}
              />
            </FormControl>
            <FormControl fullWidth className={classes.margin} error={login && login.failed}>
              <div className={classes.label}>Password</div>
              <TextField
                required
                fullWidth
                variant="outlined"
                name="password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Your password"
                value={password || ''}
                onChange={this.handleChange('password')}
                autoComplete="current-password"
                classes={{ root: classes.input }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKey className={classes.icon} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={this.handleClickShowPassword}
                        onMouseDown={this.handleMouseDownPassword}
                      >
                        {showPassword ? <Visibility className={classes.icon} /> : <VisibilityOff className={classes.icon} />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </FormControl>
            <div className={classes.divider} style={{ marginTop: 40 }} />
            <div className={classes.actions} style={{ marginTop: 20 }}>
              <Button
                outlined
                onClick={this.handleRegister}
              >
                Register
              </Button>
              <Button
                type="submit"
                onClick={this.handleSubmit}
              >
                Login
              </Button>
            </div>
            <div className={classes.actions} style={{ marginTop: 10 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked}
                    onChange={onCheckChange('checkedB')}
                    value="checkedB"
                    color="primary"
                  />
                }
                label="Remember me"
                classes={{ root: classes.checkbox }}
              />
              <Link to={routes.FORGOT_PASSWORD} className={classes.link}>
                Forgot password?
              </Link>
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

Login.defaultProps = {
  onCheckChange: () => {}
};

Login.propTypes = {
  onCheckChange: PropTypes.func,
  checked: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  login: PropTypes.object,
  classes: PropTypes.object
};
export default withRouter(connect(mapStateToProps)(withStyles(styles)(Login)));
