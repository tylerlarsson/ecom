import React from 'react';
import PropTypes from 'prop-types';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import { content, container } from 'assets/jss/material-dashboard-react';

const AdminContent = ({ classes, children }) => (
  <div className={classes.content}>
    <div className={classes.container}>{children}</div>
  </div>
);

AdminContent.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired
};

export default withStyles({ content, container })(AdminContent);
