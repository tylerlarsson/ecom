import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map } from 'lodash';
import { withStyles, AppBar, Toolbar, Typography } from '@material-ui/core';
import { Done, ChevronRight } from '@material-ui/icons';
import { COURSE_STEPS } from 'constants/default';
import routes from 'constants/routes.json';

const styles = {
  wrap: {
    display: 'flex',
    flexDirection: 'row',
    background: '#1a8d81',
    bottom: 0,
    top: 'auto'
  },
  icon: {
    marginRight: 16,
    color: '#aaa'
  },
  iconDone: {
    marginLeft: 16,
    color: 'green'
  },
  step: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover': {
      background: '#167a70',
      cursor: 'pointer'
    },
    '&.active': {
      background: '#167a70'
    }
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    border: '1px solid #fff',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    '&.active': {
      background: '#fff',
      color: '#167a70'
    }
  },
  title: {
    marginLeft: 16
  }
};

class CourseSteps extends Component {
  onChange = event => {
    this.setState({ title: event.target.value });
  };

  render() {
    const { classes, active, history, courseId } = this.props;
    const urls = {
      2: `${routes.ADMIN}${routes.CURRICULUM}`.replace(':course', courseId)
    };
    return (
      <AppBar elevation={1} position="sticky" className={classes.wrap}>
        {map(COURSE_STEPS, (item, index) => (
          <Toolbar
            className={`${classes.step} ${parseInt(active) === parseInt(index) ? 'active' : ''}`}
            onClick={urls[index] ? history && history.push(urls[index]) : null}
          >
            {index < 4 ?
              ((parseInt(index) === 1 && parseInt(active) > 1) ?
                <Done /> :
                <div className={`${classes.circle} ${parseInt(active) === parseInt(index) ? 'active' : ''}`}>
                  <Typography>{index}</Typography>
                </div>) : null}
            <Typography className={classes.title}>{item}</Typography> {index >= 4 ? <ChevronRight /> : null}
          </Toolbar>
        ))}
      </AppBar>
    );
  }
}

CourseSteps.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default connect(null)(withStyles(styles)(CourseSteps));
