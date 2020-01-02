import React from 'react';
import PropTypes from 'prop-types';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import { Avatar, Typography } from '@material-ui/core';

const styles = theme => ({
  root: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 161,
    background: theme.palette.primary.main,
    // display: 'flex',
    // justifyContent: 'flex-start',
    color: '#fff',
    '& a': {
      color: '#000',
      textDecoration: 'none'
    }
  },
  review: {
    width: '100%',
    padding: '17px 247px 0 111px'
  },
  text: {
    fontStyle: 'italic',
    fontSize: 18
  },
  reviewer: {
    display: 'flex',
    justifyContent: 'flex-start'
  },
  avatarWrap: {
    width: 111
  },
  avatar: {
    width: 48,
    height: 48,
    float: 'right',
    marginRight: 16
  },
  name: {
    fontSize: 16,
    paddingTop: 12,
    lineHeight: '14px'
  },
  username: {
    fontSize: 12,
    color: '#ccc'
  }
});

const AuthReview = ({ classes, text, name, username, avatar }) => (
  <div className={classes.root}>
    <div className={classes.review}>
      <Typography className={classes.text}>{text}</Typography>
    </div>
    <div className={classes.reviewer}>
      <div className={classes.avatarWrap}>
        <Avatar className={classes.avatar} src={avatar} />
      </div>
      <div>
        <Typography component="div" className={classes.name}>
          {name}
        </Typography>
        <Typography component="div" className={classes.username}>
          {username}
        </Typography>
      </div>
    </div>
  </div>
);

AuthReview.propTypes = {
  avatar: PropTypes.string,
  username: PropTypes.string,
  name: PropTypes.string,
  text: PropTypes.string,
  classes: PropTypes.object
};

export default withStyles(styles)(AuthReview);
