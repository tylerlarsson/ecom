import React from 'react';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import routes from 'constants/routes.json';

const headerStyle = theme => ({
  root: {
    position: 'absolute',
    bottom: 45,
    left: 50,
    right: 50,
    display: 'flex',
    justifyContent: 'flex-start',
    color: theme.palette.secondary.dark,
    '& a': {
      color: theme.palette.primary.link,
      textDecoration: 'none'
    }
  }
});

const AuthFooter = ({ classes, courseId, prevLink, nextLink }) => (
  <div className={classes.root}>
    <Link to={routes.PRIVACY}>Terms - Privacy</Link>
  </div>
);

export default withStyles(headerStyle)(AuthFooter);
