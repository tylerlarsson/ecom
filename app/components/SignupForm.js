import React from 'react';
import Button from '@material-ui/core/Button';
import { fade, withStyles, makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { Link } from 'react-router-dom';
import InputBase from '@material-ui/core/InputBase';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import routes from '../constants/routes.json';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: 40
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.secondary.main,
    borderRadius: 2,
    fontSize: 17,
    fontWeight: 'bold',
    height: 50,
    width: 'auto',
    lineHeight: '21px',
    padding: '13px 68px',
    textTransform: 'capitalize',
    '&:hover': {
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.secondary.main
    }
  },
  title: {
    color: theme.palette.secondary.main,
    fontSize: 30,
    fontWeight: 'bold'
  },
  label: {
    color: `${theme.palette.secondary.main} !important;`,
    fontSize: 21
  },
  subtitle: {
    color: theme.palette.secondary.main,
    fontSize: 17,
    '& a': {
      color: theme.palette.secondary.main,
      fontSize: 17,
      opacity: 1,
      textDecoration: 'underline'
    }
  },
  margin: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
}));

const BootstrapInput = withStyles(theme => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3)
    }
  },
  input: {
    borderRadius: 2,
    position: 'relative',
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 23,
    width: 345,
    padding: '10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    '&:focus': {
      boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main
    }
  }
}))(InputBase);

export default function SignupForm() {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5" className={classes.title}>
          Sign up
        </Typography>
        <div className={classes.subtitle}>
          or <Link to={routes.LOGIN}>log in</Link>
        </div>
        <form className={classes.form} noValidate>
          <FormControl className={classes.margin}>
            <InputLabel
              shrink
              htmlFor="email"
              classes={{
                root: classes.label,
                focused: classes.label
              }}
            >
              Username or email address
            </InputLabel>
            <BootstrapInput
              required
              fullWidth
              id="email"
              name="email"
              autoComplete="email"
              autoFocus
            />
          </FormControl>
          <FormControl className={classes.margin}>
            <InputLabel shrink htmlFor="password" className={classes.label}>
              Password
            </InputLabel>
            <BootstrapInput
              required
              fullWidth
              name="password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign up
          </Button>
        </form>
      </div>
    </Container>
  );
}
