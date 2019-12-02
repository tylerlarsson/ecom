import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map, forEach, find } from 'lodash';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import { Fab, Paper, Tabs, Tab } from '@material-ui/core';
// core components
import GridItem from 'components/Grid/GridItem';
import GridContainer from 'components/Grid/GridContainer';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import CustomNavbar from 'components/Navbars/CustomNavbar';
import AdminContent from 'components/Content/AdminContent';
import { createSection, getCourse, createLecture } from 'redux/actions/courses';
import routes from 'constants/routes.json';
import NewLectureButton from 'components/Lecture/NewLectureButton';
import Section from 'components/Course/Section';
import Lecture from 'components/Lecture/Lecture';
import LectureTitle from 'components/Lecture/LectureTitle';
import TabPanel from 'components/Lecture/TabPanel';

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
  btn: {
    marginRight: 16
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

class CourseCurriculum extends Component {
  constructor(props) {
    super(props);
    this.state = {
      course: null,
      tab: 0
    };
  }

  componentWillMount() {
    const { match } = this.props;
    const courseId = match && match.params && match.params.course;
    console.log('componentWillMount', courseId);
    this.props.getCourseAction({ id: courseId });
  }

  componentDidUpdate(prevProps, prevState) {
    const { course } = this.props;

    if (course !== prevState.course) {
      this.setCourse(course);
    }
  }

  setCourse = course => {
    const { match } = this.props;
    const lectureId = match && match.params && match.params.lecture;
    let section = null;
    let lecture = null;
    forEach(course && course.sections, sectionItem => {
      forEach(sectionItem && sectionItem.lectures, item => {
        if (item._id === lectureId) {
          lecture = item;
          section = sectionItem;
        }
      });
    });
    this.setState({ course, section, lecture });
  };

  handleBack = () => {
    const { match, history } = this.props;
    const courseId = match && match.params && match.params.course;

    history.push(`${routes.ADMIN}${routes.CURRICULUM}`.replace(':course', courseId));
  };

  onChange = field => event => {
    this.setState({ [field]: event.target.value });
  };

  handlePublish = () => {
    const { createSectionAction } = this.props;
    const { course } = this.state;

    const payload = {
      title: 'New Section',
      courseId: course && course.id
    };
    createSectionAction(payload);
  };

  onChangeTitle = title => {
    console.log('onChangeTitle', title);
    const { createLectureAction } = this.props;
    const { course } = this.state;
    const payload = {
      title,
      file: 'file',
      image: 'image',
      text: 'lecture text',
      allowComments: false,
      state: 'draft',
      courseId: course && course.id,
      section: course._id
    };
    console.log('onChangeTitle', payload, course);
    // createLectureAction(payload);
  };

  onCheckSection = () => {
    // TODO
    console.log('onCheckSection');
  };

  onChangeSection = () => {
    // TODO
    console.log('onChangeSection');
  };

  handleNewLecture = () => {
    // TODO
    console.log('handleNewLecture');
  };

  handlePreview = () => {
    // TODO
    console.log('handlePreview');
  };

  renderNavbar = classes => (
    <>
      <Fab
        className={classes.btn}
        variant="extended"
        color="default"
        size="medium"
        aria-label="like"
        onClick={this.handleNewLecture}
      >
        New Lecture
      </Fab>
      <Fab variant="extended" color="default" size="medium" aria-label="like" onClick={this.handlePreview}>
        Preview
      </Fab>
      <Fab
        variant="extended"
        size="medium"
        aria-label="like"
        className={classes.fab}
        onClick={this.handlePublish}
      >
        Publish
      </Fab>
    </>
  );

  changeTab = (event, tab) => {
    this.setState({ tab });
  };

  render() {
    const { classes } = this.props;
    const { course, lecture = {}, tab } = this.state;
    const sections = (course && course.sections) || [];
    console.log('lecture page', lecture);
    return (
      <>
        <CustomNavbar
          component={
            <LectureTitle title={lecture.title} onChange={this.onChangeTitle} onBack={this.handleBack} />
          }
          right={this.renderNavbar(classes)}
        />
        <AdminContent>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Paper square>
                <Tabs
                  value={tab}
                  indicatorColor="primary"
                  textColor="primary"
                  onChange={this.changeTab}
                  aria-label="disabled tabs example"
                >
                  <Tab label="Add File" />
                  <Tab label="Add Text" />
                  <Tab label="Add Quiz" />
                  <Tab label="Add Code" />
                </Tabs>
                <TabPanel value={tab} index={0}>
                  Page One
                </TabPanel>
                <TabPanel value={tab} index={1}>
                  Page Two
                </TabPanel>
                <TabPanel value={tab} index={2}>
                  Page Three
                </TabPanel>
                <TabPanel value={tab} index={3}>
                  Page Three
                </TabPanel>
              </Paper>
            </GridItem>
          </GridContainer>
        </AdminContent>
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
