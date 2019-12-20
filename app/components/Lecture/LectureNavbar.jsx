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
    background: '#000',
    color: '#fff',
    height: 50,
    minHeight: '50px !important',
    '& > div': {
      height: 50,
      minHeight: '50px !important'
    },
    '& a': {
      color: '#fff',
      textDecoration: 'none'
    }
  }
});

const LectureNavbar = ({ classes, courseId, prevLink, nextLink }) => (
  <AppBar elevation={1} position="sticky" classes={{ root: classes.root }}>
    <Toolbar>
      <GridContainer style={{ width: '100%' }}>
        <GridItem xs={12} sm={3} md={3} lg={2} style={{ borderRight: '1px solid #666' }}>
          <Link to={routes.COURSES_ENROLLED.replace(':course', courseId)}>
            <ChevronLeft />
          </Link>
        </GridItem>
        <GridItem xs={12} sm={9} md={9} lg={5}>
          {prevLink ? (
            <Link to={prevLink}>
              <ChevronLeft /> Previous Lecture
            </Link>
          ) : null}
        </GridItem>
        <GridItem xs={12} sm={9} md={9} lg={5}>
          {nextLink ? (
            <Link to={nextLink}>
              Next Lecture <ChevronRight />
            </Link>
          ) : null}
        </GridItem>
      </GridContainer>
    </Toolbar>
  </AppBar>
);

export default withStyles(headerStyle)(LectureNavbar);
