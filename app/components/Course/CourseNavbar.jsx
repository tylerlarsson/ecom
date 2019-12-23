import React from 'react';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import { AppBar, Avatar, Toolbar, Typography } from '@material-ui/core';
import UserIcon from '@material-ui/icons/Person';

const headerStyle = theme => ({
  root: {
    background: '#000',
    color: '#fff',
    height: 50,
    minHeight: '50px !important',
    '& > div': {
      height: 50,
      minHeight: '50px !important'
    }
  },
  grow: {
    flex: 1
  },
  user: {
    float: 'right',
    display: 'flex',
    alignItems: 'center'
  },
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    marginLeft: 16
  }
});

const CourseNavbar = ({ classes, title, user }) => (
  <AppBar elevation={1} position="sticky" classes={{ root: classes.root }}>
    <Toolbar>
      {title ? (
        <Typography variant="h6">
          {title}
        </Typography>
      ) : null}
      <div className={classes.grow} />
      <div className={classes.user}>
        {user && user.name} <Avatar className={classes.small}><UserIcon /></Avatar>
      </div>
    </Toolbar>
  </AppBar>
);

export default withStyles(headerStyle)(CourseNavbar);
