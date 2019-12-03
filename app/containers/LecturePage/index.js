import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map, forEach, filter } from 'lodash';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import { Fab, Paper, Tabs, Tab, Button } from '@material-ui/core';
// core components
import GridItem from 'components/Grid/GridItem';
import GridContainer from 'components/Grid/GridContainer';
import CustomNavbar from 'components/Navbars/CustomNavbar';
import AdminContent from 'components/Content/AdminContent';
import { createSection, getCourse, createLecture } from 'redux/actions/courses';
import routes from 'constants/routes.json';
import LectureTitle from 'components/Lecture/LectureTitle';
import TabPanel from 'components/Lecture/TabPanel';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import LectureContent from 'components/Lecture/LectureContent';
import Dropzone from 'react-dropzone';

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
  fabSave: {
    background: 'orange',
    margin: 'auto !important',
    width: '60% !important',
    display: 'block'
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
  },
  paperWrap: {
    marginBottom: 60
  }
};

class CourseCurriculum extends Component {
  constructor(props) {
    super(props);
    this.state = {
      course: null,
      tab: 0,
      editorState: EditorState.createEmpty(),
      content: [
        {type: 'text', content: 'test'},
        {type: 'image', url: 'http://google.com'},
      ]
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

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState
    });
  };

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

  handleAddText = () => {
    const { editorState, content } = this.state;
    this.setState({ content: [{ type: 'text', content: editorState }, ...content] });
  };

  onDeleteContent = index => () => {
    const { content } = this.state;
    const newContent = filter(content, (item, key) => index !== key);
    this.setState({ content: newContent });
  };

  onEditContent = index => () => {
    // TODO edit
  };

  render() {
    const { classes } = this.props;
    const { lecture = {}, tab, editorState, content } = this.state;
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
              <Paper square className={classes.paperWrap}>
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
                  <Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)}>
                    {({ getRootProps, getInputProps }) => (
                      <section>
                        <div {...getRootProps()}>
                          <input {...getInputProps()} />
                          <p>Drag 'n' drop some files here, or click to select files</p>
                        </div>
                      </section>
                    )}
                  </Dropzone>
                </TabPanel>
                <TabPanel value={tab} index={1}>
                  <Editor
                    editorState={editorState}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName={styles.wrapperClassName}
                    editorClassName={styles.wrapperClassName}
                    onEditorStateChange={this.onEditorStateChange}
                    editorStyle={{ height: 200, border: '1px solid #eee' }}
                    wrapperStyle={{ minHeight: 200, width: '60%', margin: 'auto', marginBottom: 24 }}
                  />
                  <Fab className={classes.fabSave} variant="extended" color="default" size="medium" aria-label="like" onClick={this.handleAddText}>
                    Save
                  </Fab>
                </TabPanel>
                <TabPanel value={tab} index={2}>
                  Quiz form
                </TabPanel>
                <TabPanel value={tab} index={3}>
                  Code form
                </TabPanel>
              </Paper>
              {map(content, (item, index) => (
                <LectureContent data={item} onEdit={this.onEditContent(index)} onDelete={this.onDeleteContent(index)} />
              ))}
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
