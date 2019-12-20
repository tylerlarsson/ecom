import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map, orderBy, findIndex } from 'lodash';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import Fab from '@material-ui/core/Fab';
// core components
import GridItem from 'components/Grid/GridItem';
import GridContainer from 'components/Grid/GridContainer';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import AdminNavbar from 'components/Navbars/AdminNavbar';
import AdminContent from 'components/Content/AdminContent';
import { createSection, getCourse, createLecture } from 'redux/actions/courses';
import routes from 'constants/routes.json';
import NewLectureButton from 'components/LectureAdmin/NewLectureButton';
import Section from 'components/CourseAdmin/Section';
import Lecture from 'components/LectureAdmin/Lecture';
// import { DND_DELAY } from 'constants/default';
import CourseSteps from 'components/CourseAdmin/CourseSteps';

const styles = {
  cardCategoryWhite: {
    '&,& a,& a:hover,& a:focus': {
      color: 'rgba(255,255,255,.62)',
      margin: '0',
      fontSize: '14px',
      marginTop: '0',
      marginBottom: '0'
    },
    '& a,& a:hover,& a:focus': {
      color: '#FFFFFF'
    }
  },
  cardTitleWhite: {
    color: '#FFFFFF',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: "Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none',
    '& small': {
      color: '#777',
      fontSize: '65%',
      fontWeight: '400',
      lineHeight: '1'
    }
  },
  fab: {
    background: 'orange',
    marginLeft: 16
  },
  subtitle: {
    marginTop: 24,
    marginBottom: 24
  },
  formControl: {
    marginBottom: 24
  },
  footer: {
    justifyContent: 'flex-end'
  },
  card: {
    padding: 24
  },
  selectLabel: {
    marginBottom: 16
  }
};

const SortableItemLecture = SortableElement(({ value }) => {
  const { onCheckSection, onChangeLecture, ...lecture } = value;

  return (
    <Lecture
      key={lecture.id}
      title={lecture.title}
      checked={false}
      onCheck={onCheckSection}
      onChange={onChangeLecture}
    />
  );
});

const SortableListLectures = SortableContainer(({ items }) => (
  <div>
    {items.map((value, index) => (
      <SortableItemLecture key={`item-${index}`} index={index} value={value} /> // eslint-disable-line
    ))}
  </div>
));

const SortableItem = SortableElement(({ value }) => {
  const {
    classes,
    onChangeSection,
    onChangeLecture,
    onCheckSection,
    onNewLecture,
    sortIndex,
    onSortEndLectures,
    ...section
  } = value;
  const contentItems = map(section.lectures, item => ({
    ...item,
    onCheckSection,
    onChangeLecture: onChangeLecture(item)
  }));
  return (
    <Card className={classes.card}>
      <CardBody>
        <Section
          key={section._id || section.id}
          onChange={onChangeSection(section, sortIndex)}
          title={section.title}
          checked={false}
          onCheck={onCheckSection}
        />
        <SortableListLectures
          items={[...contentItems]}
          onSortEnd={onSortEndLectures(section._id || section.id)}
          useDragHandle
        />
        {/* {map(section.lectures, lecture => ( */}
        {/* <Lecture */}
        {/* key={lecture.id} */}
        {/* title={lecture.title} */}
        {/* checked={false} */}
        {/* onCheck={onCheckSection} */}
        {/* onChange={onChangeLecture(lecture)} */}
        {/* /> */}
        {/* ))} */}
        <NewLectureButton onSelect={onNewLecture(section._id || section.id)} />
      </CardBody>
    </Card>
  );
});

const SortableList = SortableContainer(({ items }) => (
  <div>
    {items.map((value, index) => (
      <SortableItem key={`item-${index}`} index={index} value={value} /> // eslint-disable-line
    ))}
  </div>
));

class CourseCurriculum extends Component {
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

  onChange = field => event => {
    this.setState({ [field]: event.target.value });
  };

  handleCreateSection = () => {
    const { createSectionAction } = this.props;
    const { course } = this.state;

    const payload = {
      title: 'New Section',
      courseId: course && course.id
    };
    createSectionAction(payload);
  };

  onNewLecture = sectionId => () => {
    const { createLectureAction } = this.props;
    const { course } = this.state;
    const payload = {
      title: 'New LectureAdmin',
      file: 'file',
      image: 'image',
      text: '',
      allowComments: false,
      state: 'draft',
      courseId: course && course.id,
      section: sectionId
    };
    createLectureAction(payload);
  };

  onCheckSection = () => {
    // TODO
    console.log('onCheckSection');
  };

  onChangeSection = (section, sortIndex) => title => {
    const { createSectionAction } = this.props;
    const { course } = this.state;
    const payload = {
      title,
      id: section._id || section.id,
      index: sortIndex,
      courseId: course && (course.id || course._id)
    };
    createSectionAction(payload);
  };

  onChangeLecture = lecture => () => {
    const { course } = this.state;
    const { history } = this.props;
    const lectureRoute = `${routes.ADMIN}${routes.NEW_LECTURE}`
      .replace(':course', course && course.id)
      .replace(':lecture', lecture.id || lecture._id);
    history.push(lectureRoute);
  };

  handlePreview = () => {
    const { course } = this.state;
    const lectureRoute = routes.COURSES_ENROLLED.replace(':course', course && course.id);
    const win = window.open(lectureRoute, '_blank');
    win.focus();
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { createSectionAction } = this.props;
    const course = { ...this.state.course }; // eslint-disable-line
    const sections = [...course.sections];
    course.sections = arrayMove(sections, oldIndex, newIndex);
    this.setState({ course });
    // TODO update dbase
    const payload = {
      sections: course.sections,
      courseId: course && course.id
    };
    createSectionAction(payload);
  };

  onSortEndLectures = sectionId => ({ oldIndex, newIndex }) => {
    console.log('onSortEndLectures', sectionId);
    const { createSectionAction } = this.props;
    const course = { ...this.state.course }; // eslint-disable-line
    const sections = [...course.sections];
    const sectionIndex = findIndex(sections, s => (s._id || s.id) === sectionId);

    if (sectionIndex > -1) {
      const section = { ...sections[sectionIndex] };
      const lectures = [...section.lectures];
      section.lectures = map(arrayMove(lectures, oldIndex, newIndex), (item, index) => ({
        ...item,
        id: item.id,
        index
      }));
      course.sections[sectionIndex] = section;
      this.setState({ course });
      const payload = {
        ...section,
        id: sectionId,
        courseId: course && course.id
      };
      createSectionAction(payload);
    }
  };

  renderNavbar = classes => (
    <>
      <Fab variant="extended" color="default" size="medium" aria-label="like" onClick={this.handlePreview}>
        preview
      </Fab>
      <Fab
        variant="extended"
        size="medium"
        aria-label="like"
        className={classes.fab}
        onClick={this.handleCreateSection}
      >
        New Section
      </Fab>
    </>
  );

  render() {
    const { classes, history } = this.props;
    const { course } = this.state;
    const sections = (course && course.sections) || [];
    // const sections = orderBy((course && course.sections) || [], ['index'], ['asc']);

    const contentItems = map(sections, (item, index) => ({
      ...item,
      sortIndex: index,
      onChangeSection: this.onChangeSection,
      onCheckSection: this.onCheckSection,
      onChangeLecture: this.onChangeLecture,
      onNewLecture: this.onNewLecture,
      onSortEndLectures: this.onSortEndLectures,
      classes
    }));
    return (
      <>
        <AdminNavbar title="Curriculum" right={this.renderNavbar(classes)} />
        <AdminContent>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <SortableList items={[...contentItems]} onSortEnd={this.onSortEnd} useDragHandle />
            </GridItem>
          </GridContainer>
        </AdminContent>
        <CourseSteps active={2} courseId={course && (course.id || course._id)} history={history} />
      </>
    );
  }
}

CourseCurriculum.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  course: PropTypes.objectOf(PropTypes.any),
  getCourseAction: PropTypes.func.isRequired,
  createSectionAction: PropTypes.func.isRequired,
  createLectureAction: PropTypes.func.isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired
};

const mapStateToProps = ({ courses }) => ({
  course: courses.course
});

const mapDispatchToProps = dispatch => ({
  createSectionAction: data => {
    dispatch(createSection(data));
  },
  createLectureAction: data => {
    dispatch(createLecture(data));
  },
  getCourseAction: data => {
    dispatch(getCourse(data));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(CourseCurriculum));
