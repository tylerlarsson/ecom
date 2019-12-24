import React from 'react';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import { AppBar, Avatar, Toolbar, Typography } from '@material-ui/core';
import { ChevronLeft, ChevronRight } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import routes from 'constants/routes.json';

const headerStyle = theme => ({
  root: {
    position: 'absolute',
    bottom: 45,
    left: 50,
    right: 50,
    display: 'flex',
    justifyContent: 'flex-start',
    color: '#000',
    '& a': {
      color: '#000',
      textDecoration: 'none'
    }
  }
});

const LectureNavbar = ({ classes, courseId, prevLink, nextLink }) => (
  <div className={classes.root}>
    <Link to={routes.HOME}>Terms - Privacy</Link>
  </div>
);

export default withStyles(headerStyle)(LectureNavbar);
