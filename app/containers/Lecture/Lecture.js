import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { orderBy } from 'lodash';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import { Typography, Box, Button } from '@material-ui/core';
// core components
import GridItem from 'components/Grid/GridItem';
import GridContainer from 'components/Grid/GridContainer';
import CourseNavbar from 'components/Course/CourseNavbar';
import CourseContent from 'components/Course/CourseContent';
import { createCourse, getCourse } from 'redux/actions/courses';
import routes from 'constants/routes.json';
import CourseProgress from 'components/Course/CourseProgress';

const styles = {
  subtitle: {
    marginTop: 24,
    marginBottom: 24
  },
  nextBtn: {
    background: '#f2ce79'
  }
};

class Course extends Component {
  constructor(props) {
    super(props);
    this.state = {
      course: null
    };
  }

  componentWillMount() {
    const { match, getCourseAction } = this.props;
    const courseId = match && match.params && match.params.course;
    getCourseAction({ id: courseId });
  }

  componentDidUpdate(prevProps) {
    const { course } = this.props;

    if (course !== prevProps.course) {
      this.setCourse(course);
    }
  }

  setCourse = course => {
    const sortedSections = orderBy((course && course.sections) || [], ['index'], ['asc']);
    this.setState({ course: { ...course, sections: sortedSections } });
  };

  handleNextLection = () => {
    const { history, course } = this.props;

    if (course) {
      const lecture = course.sections && course.sections[0] && course.sections[0].lectures && course.sections[0].lectures[0];
      if (lecture) {
        history.push(
          routes.LECTURE.replace(':course', course && course.id).replace(':lecture', lecture.id || lecture._id)
        );
      }
    }
  };

  render() {
    const { classes, user } = this.props;
    const { course } = this.state;

    return (
      <>
        <CourseNavbar user={{ name: 'Admin' }} />
        <CourseContent>
          <GridContainer>
            <GridItem xs={12} sm={3} md={3} lg={2}>
              <CourseProgress title={course && course.title} progress={10} />
            </GridItem>
            <GridItem xs={12} sm={9} md={9} lg={10}>
              <Typography component="div" classes={{ root: classes.subtitle }}>
                <Box fontSize={18} fontWeight={500}>
                  Course Curriculum
                </Box>
              </Typography>
              <div>
                <Button variant="contained" className={classes.nextBtn} onClick={this.handleNextLection}>
                  Start next lecture
                </Button>
              </div>
            </GridItem>
          </GridContainer>
        </CourseContent>
      </>
    );
  }
}

Course.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  getCourseAction: PropTypes.func.isRequired,
  createCourseAction: PropTypes.func.isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  course: PropTypes.objectOf(PropTypes.any),
};

const mapStateToProps = ({ courses, users, auth }) => ({
  user: auth.user.data,
  course: courses.course
});

const mapDispatchToProps = dispatch => ({
  getCourseAction: data => {
    dispatch(getCourse(data));
  },
  createCourseAction: data => {
    dispatch(createCourse(data));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Course));
