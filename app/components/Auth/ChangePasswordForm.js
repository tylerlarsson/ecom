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
      confirmPassword: '',
      password: '',
      showConfirmPassword: false,
      showPassword: false
    };
  }

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  validate = () => {
    const { confirmPassword, password } = this.state;

    if (!confirmPassword || !password) {
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

  handleClickShowConfirmPassword = () => {
    this.setState(state => ({ showConfirmPassword: !state.showConfirmPassword }));
  };

  handleMouseDownPassword = event => {
    event.preventDefault();
  };

  render() {
    const { classes, login } = this.props;
    const { confirmPassword, password, showPassword, showConfirmPassword } = this.state;

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <div className={classes.subtitle} style={{ marginBottom: 21 }}>
            CREATE A NEW PASSWORD, IT’S EASY.
          </div>
          <Typography component="h1" variant="h5" className={classes.title} style={{ marginBottom: 15 }}>
            Change Password
          </Typography>
          <form className={classes.form}>
            <FormControl fullWidth className={classes.margin} error={login && login.failed}>
              <div className={classes.label}>New Password</div>
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
                        {showPassword ? <Visibility className={classes.iconVis} /> : <VisibilityOff className={classes.iconVis} />}
                      </IconButton>
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
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirm_password"
                placeholder="Confirm Password"
                value={confirmPassword || ''}
                onChange={this.handleChange('confirmPassword')}
                autoComplete="current-password"
                classes={{ root: classes.input }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      &nbsp;
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={this.handleClickShowConfirmPassword}
                        onMouseDown={this.handleMouseDownPassword}
                      >
                        {showPassword ? <Visibility className={classes.iconVis} /> : <VisibilityOff className={classes.iconVis} />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </FormControl>
            <div className={classes.divider} style={{ marginTop: 40 }} />
            <div className={classes.actionsCenter} style={{ marginTop: 20 }}>
              <Button
                type="submit"
                onClick={this.handleSubmit}
              >
                Confirm
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
