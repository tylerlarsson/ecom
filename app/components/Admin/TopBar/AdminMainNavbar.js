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
    },
  }
});

const AdminMainNavbar = ({ classes, title, right }) => (
  <AppBar elevation={1} position="fixed" className={classes.root}>
    <Toolbar>
      <Typography variant="h6">
        <Link to={routes.HOME}>
          <img src={Logo} width="auto" alt="" />
        </Link>
      </Typography>
      <div className={classes.grow} />
      <div style={{ float: 'right' }}>{right}</div>
    </Toolbar>
  </AppBar>
);

AdminMainNavbar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AdminMainNavbar);
