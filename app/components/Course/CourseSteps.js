import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map } from 'lodash';
import { withStyles, AppBar, Toolbar, Typography } from '@material-ui/core';
import { Done, ChevronRight } from '@material-ui/icons';
import { COURSE_STEPS } from 'constants/default';
import routes from 'constants/routes.json';
import {setUserAction} from "../../redux/actions/auth";

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

class CourseSteps extends PureComponent {
  handleClick = url => () => {
    const { history } = this.props;

    if (url && history) {
      history.push(url);
    }
  };

  render() {
    const { classes, active, courseId } = this.props;
    const urls = {
      2: courseId ? `${routes.ADMIN}${routes.CURRICULUM}`.replace(':course', courseId) : null,
      3: courseId ? `${routes.ADMIN}${routes.PRICING}`.replace(':course', courseId) : null
    };
    return (
      <AppBar elevation={1} position="sticky" className={classes.wrap}>
        {map(COURSE_STEPS, (item, index) => (
          <Toolbar
            key={index}
            className={`${classes.step} ${parseInt(active, 10) === parseInt(index, 10) ? 'active' : ''}`}
            onClick={this.handleClick(urls[index])}
          >
            {index < 4 ? ( // eslint-disable-line
              parseInt(index, 10) === 1 && parseInt(active, 10) > 1 ? (
                <Done />
              ) : (
                <div className={`${classes.circle} ${parseInt(active, 10) === parseInt(index, 10) ? 'active' : ''}`}>
                  <Typography>{index}</Typography>
                </div>
              )
            ) : null}
            <Typography className={classes.title}>{item}</Typography> {index >= 4 ? <ChevronRight /> : null}
          </Toolbar>
        ))}
      </AppBar>
    );
  }
}

CourseSteps.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  active: PropTypes.number,
  courseId: PropTypes.string
};

export default withStyles(styles)(CourseSteps);
