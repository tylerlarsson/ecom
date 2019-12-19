import React from 'react';
// @material-ui/core components
import { lighten, withStyles } from '@material-ui/core/styles';
import { LinearProgress, Typography } from '@material-ui/core';

const styles = {
  root: {
    flex: 1,
    width: '100%',
    padding: 10,
    background: '#efefef !important'
  },
  title: {
    textTransform: 'uppercase',
    marginBottom: 20
  },
  progress: {
    textTransform: 'uppercase',
    width: '100%',
    display: 'block',
    textAlign: 'center',
    color: '#e4ae77',
    fontSize: 14,
    '& span': {
      fontSize: 16,
      fontWeight: 'bold'
    }
  }
};

const BorderLinearProgress = withStyles({
  root: {
    height: 15,
    backgroundColor: lighten('#bbb', 0.5),
    borderRadius: 20,
    marginBottom: 15
  },
  bar: {
    borderRadius: 20,
    backgroundColor: '#bbb',
  },
})(LinearProgress);

const CourseNavbar = ({ classes, title, progress }) => (
  <div className={classes.root}>
    {title ? (
      <Typography variant="h6" className={classes.title}>
        {title}
      </Typography>
    ) : null}
    <BorderLinearProgress
      className={classes.margin}
      variant="determinate"
      color="secondary"
      value={progress}
    />
    <Typography variant="div" className={classes.progress}>
      <span>{progress}%</span> complete
    </Typography>
  </div>
);

export default withStyles(styles)(CourseNavbar);
