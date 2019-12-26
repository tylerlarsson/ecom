import React from 'react';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import { Grid, AppBar, Avatar, Toolbar, Typography } from '@material-ui/core';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import routes from 'constants/routes.json';

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
    justifyContent: 'flex-start',
  },
  avatarWrap: {
    width: 111,
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

const AuthReview = ({ classes, text, reviewer = {} }) => (
  <div className={classes.root}>
    <div className={classes.review}>
      <Typography className={classes.text}>{text}</Typography>
    </div>
    <div className={classes.reviewer}>
      <div className={classes.avatarWrap}>
        <Avatar className={classes.avatar} src={reviewer.avatar} />
      </div>
      <div>
        <Typography component="div" className={classes.name}>{reviewer.name}</Typography>
        <Typography component="div" className={classes.username}>{reviewer.username}</Typography>
      </div>
    </div>
  </div>
);

export default withStyles(styles)(AuthReview);
