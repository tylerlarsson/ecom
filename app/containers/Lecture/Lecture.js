import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { orderBy, findIndex, size, forEach, map } from 'lodash';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import { Typography, Box } from '@material-ui/core';
// core components
import GridItem from 'components/Grid/GridItem';
import GridContainer from 'components/Grid/GridContainer';
import LectureNavbar from 'components/Lecture/LectureNavbar';
import CourseContent from 'components/Course/CourseContent';
import { getCourse } from 'redux/actions/courses';
import routes from 'constants/routes.json';
import CourseProgress from 'components/Course/CourseProgress';
import LectureContent from 'components/Lecture/LectureContent';

const styles = {
  subtitle: {
    marginTop: 24,
    marginBottom: 24
  },
  nextBtn: {
    background: '#f2ce79'
  }
};

class Lecture extends Component {
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
    const { classes, match } = this.props;
    const { course } = this.state;
    const lectureId = match && match.params && match.params.lecture;
    let section = null;
    let lecture = {};
    forEach(course && course.sections, sectionItem => {
      forEach(sectionItem && sectionItem.lectures, item => {
        if (item._id === lectureId || item.id === lectureId) {
          lecture = item;
          section = sectionItem;
        }
      });
    });
    let prevLink;
    let nextLink;

    if (course) {
      const lectures = section && section.lectures;
      const lectureIndex = findIndex(lectures, item => item.id === lectureId || item._id === lectureId);

      if (lectureIndex > -1) {
        const lecturePrevIndex = lectureIndex - 1;
        if (lecturePrevIndex > -1) {
          const lecturePrevId = lectures[lecturePrevIndex] && lectures[lecturePrevIndex].id;
          prevLink = routes.LECTURE.replace(':course', course.id).replace(':lecture', lecturePrevId);
        }
        const lectureNextIndex = lectureIndex + 1;
        if (size(lectures) > 0 && lectureIndex < size(lectures)) {
          const lectureNextId = lectures[lectureNextIndex] && lectures[lectureNextIndex].id;

          if (lectureNextId) {
            nextLink = routes.LECTURE.replace(':course', course.id).replace(':lecture', lectureNextId);
          }
        }
      }
    }

    console.log('lecture', lecture);
    const content = lecture && lecture.text ? JSON.parse(lecture.text) : [];
    return (
      <>
        <LectureNavbar
          courseId={course && (course.id || course._id)} user={{ name: 'Admin' }}
          prevLink={prevLink}
          nextLink={nextLink}
        />
        <CourseContent>
          <GridContainer>
            <GridItem xs={12} sm={3} md={3} lg={2}>
              <CourseProgress title={course && course.title} progress={10} />
            </GridItem>
            <GridItem xs={12} sm={9} md={9} lg={10}>
              <Typography component="div" classes={{ root: classes.subtitle }}>
                <Box fontSize={18} fontWeight={500}>
                  {lecture.title}
                </Box>
              </Typography>
              <div>
                {map(content, item => (
                  <LectureContent data={item} />
                ))}
              </div>
            </GridItem>
          </GridContainer>
        </CourseContent>
      </>
    );
  }
}

Lecture.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  getCourseAction: PropTypes.func.isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  course: PropTypes.objectOf(PropTypes.any),
};

const mapStateToProps = ({ courses }) => ({
  course: courses.course
});

const mapDispatchToProps = dispatch => ({
  getCourseAction: data => {
    dispatch(getCourse(data));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Lecture));
