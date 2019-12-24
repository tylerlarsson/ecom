import React from 'react';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import { AppBar, Avatar, Toolbar, Typography } from '@material-ui/core';
import { ChevronLeft, ChevronRight } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import routes from 'constants/routes.json';
import Logo from 'assets/img/logo-black.png';

const headerStyle = theme => ({
  root: {
    position: 'absolute',
    top: 45,
    left: 50,
    right: 50,
    height: 50,
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
      display: 'black'
    }
  }
});

const LectureNavbar = ({ classes, courseId, prevLink, nextLink }) => (
  <div className={classes.root}>
    <img src={Logo} width="auto"/>
    <Link to={routes.HOME}>Home</Link>
  </div>
);

export default withStyles(headerStyle)(LectureNavbar);
