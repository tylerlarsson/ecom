import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import Logo from 'assets/img/logo-white.png';
import routes from 'constants/routes.json';

// import headerStyle from 'assets/jss/material-dashboard-react/components/headerStyle.jsx';

const styles = theme => ({
  root: {
    background: theme.palette.primary.main,
    display: 'flex',
    justifyContent: 'space-between',
    color: '#000',
    '& a': {
      color: '#000',
      textDecoration: 'none'
    },
    '& img': {
      width: 168,
      height: 20,
      display: 'block'
    }
  },
  logo: {
    width: 270,
    display: 'flex',
    justifyContent: 'center'
  },
  grow: {
    flex: 1,
    paddingLeft: 40
  },
  search: {
    fontSize: 14,
    color: theme.palette.secondary.main,
    background: 'transparent',
    border: 'none',
    outline: 'none'
  },
  right: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: 30
  }
});

const AdminMainNavbar = ({ classes, right }) => (
  <AppBar elevation={0} className={classes.root}>
    <Toolbar disableGutters>
      <Typography variant="h6" className={classes.logo}>
        <Link to={routes.HOME}>
          <img src={Logo} width="auto" alt="" />
        </Link>
      </Typography>
      <div className={classes.grow}>
        <input className={classes.search} placeholder="Search for something…" />
      </div>
      <div className={classes.right}>{right}</div>
    </Toolbar>
  </AppBar>
);

AdminMainNavbar.propTypes = {
  right: PropTypes.objectOf(PropTypes.any),
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AdminMainNavbar);
