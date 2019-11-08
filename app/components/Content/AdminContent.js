import React from 'react';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import { content, container } from 'assets/jss/material-dashboard-react.jsx';

const AdminContent = ({ classes, children }) => (
  <div className={classes.content}>
    <div className={classes.container}>{children}</div>
  </div>
);

export default withStyles({ content, container })(AdminContent);
