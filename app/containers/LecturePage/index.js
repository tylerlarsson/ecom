import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map, forEach, filter } from 'lodash';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import { Fab, Paper, Tabs, Tab } from '@material-ui/core';
// core components
import GridItem from 'components/Grid/GridItem';
import GridContainer from 'components/Grid/GridContainer';
import CustomNavbar from 'components/Navbars/CustomNavbar';
import AdminContent from 'components/Content/AdminContent';
import { createSection, getCourse, createLecture } from 'redux/actions/courses';
import routes from 'constants/routes.json';
import LectureTitle from 'components/Lecture/LectureTitle';
import TabPanel from 'components/Lecture/TabPanel';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import LectureContent from 'components/Lecture/LectureContent';
import Dropzone from 'react-dropzone';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import { getGignUrl } from 'redux/actions/files';
import { toDataURL } from '../../utils/files';
import { DND_DELAY } from 'constants/default';

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
  },
  dropzone: {
    width: '100%',
    height: 300,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '2px dashed #ddd'
  }
};

const SortableItem = SortableElement(({ value }) => {
  const { onDownload, onEdit, onDelete, ...rest } = value;

  return <LectureContent data={rest} onDownload={onDownload} onEdit={onEdit} onDelete={onDelete} />;
});

const SortableList = SortableContainer(({ items }) => (
  <div>
    {items.map((value, index) => (
      <SortableItem key={`item-${value}`} index={index} value={value} />
    ))}
  </div>
));

class CourseCurriculum extends Component {
  constructor(props) {
    super(props);
    this.state = {
      course: null,
      section: null,
      tab: 0,
      editorState: EditorState.createEmpty(),
      content: [],
      files: [],
      editIndex: null
    };
  }

  componentWillMount() {
    const { match } = this.props;
    const courseId = match && match.params && match.params.course;
    this.props.getCourseAction({ id: courseId });
  }

  componentDidUpdate(prevProps, prevState) {
    const { course, signUrl } = this.props;

    if (course !== prevState.course) {
      this.setCourse(course);
    }

    if (signUrl && signUrl !== prevProps.signUrl) {
      this.uploadFile(signUrl);
    }
  }

  onEditorStateChange = editorState => {
    this.setState({
      editorState
    });
  };

  uploadFile = signUrl => {
    const { files } = this.state;
    const file = files && files[0];

    if (file && signUrl) {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', signUrl, true);
      xhr.responseType = 'json';
      xhr.onload = () => {
        const { status } = xhr;
        if (status === 200) {
          console.log('File is uploaded');
          const fileDate = signUrl && signUrl.split('?');
          const url = fileDate && fileDate[0];
          const { content } = this.state;
          const contentNew = [{ type: 'image', url, name: file.name }, ...content];
          this.setState({ content: contentNew, files: [] }, () => {
            this.onChangeLecture({ text: JSON.stringify(contentNew) });
          });
        } else {
          console.log('Something went wrong!', xhr.status);
        }
      };

      xhr.onerror = error => {
        console.log('Upload error', error);
      };
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    }
  };

  setCourse = course => {
    const { match } = this.props;
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
    let content = [];

    if (lecture.text) {
      try {
        content = JSON.parse(lecture.text);
      } catch (e) {
        console.log('content parse error', e);
        content = [];
      }
    }

    this.setState({ course, section, lecture, content });
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
    this.onChangeLecture({ title });
  };

  onChangeLecture = (data = {}) => {
    const { createLectureAction, match } = this.props;
    const lectureId = match && match.params && match.params.lecture;
    const { course, section, lecture } = this.state;
    const payload = {
      ...lecture,
      ...data,
      id: lectureId,
      courseId: course && course.id,
      section: section._id || section.id
    };

    createLectureAction(payload);
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

  changeTab = (event, tab) => {
    this.setState({ tab });
  };

  handleAddText = () => {
    const { editorState, content, editIndex } = this.state;
    let contentNew;
    if (editIndex !== null) {
      contentNew = [...content];
      contentNew[editIndex] = { type: 'text', content: draftToHtml(convertToRaw(editorState.getCurrentContent())) };
    } else {
      contentNew = [{ type: 'text', content: draftToHtml(convertToRaw(editorState.getCurrentContent())) }, ...content];
    }

    this.setState({ content: contentNew, tab: 0, editorState: EditorState.createEmpty(), editIndex: null });
    this.onChangeLecture({ text: JSON.stringify(contentNew) });
  };

  onDeleteContent = index => () => {
    const { content } = this.state;
    const newContent = filter(content, (item, key) => index !== key);
    this.setState({ content: newContent });
    this.onChangeLecture({ text: JSON.stringify(newContent) });
  };

  onDownloadFile = item => async () => {
    const a = document.createElement('a');
    a.href = await toDataURL(item.url);
    a.download = item.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  onEditContent = index => () => {
    const { content } = this.state;
    const node = content && content[index] && content[index].content;
    const blocksFromHtml = htmlToDraft(node);
    const { contentBlocks, entityMap } = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
    this.setState({
      editorState: EditorState.createWithContent(contentState),
      tab: 1,
      editIndex: index
    });
  };

  dropFiles = acceptedFiles => {
    const { getGignUrlAction } = this.props;
    this.setState({ files: acceptedFiles });
    const filename = acceptedFiles && acceptedFiles[0] && acceptedFiles[0].name;
    getGignUrlAction({ file: filename });
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { content } = this.state;
    const newContent = arrayMove(content, oldIndex, newIndex);
    this.setState({ content: newContent });
    this.onChangeLecture({ text: JSON.stringify(newContent) });
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
      <Fab variant="extended" size="medium" aria-label="like" className={classes.fab} onClick={this.handlePublish}>
        Publish
      </Fab>
    </>
  );

  render() {
    const { classes } = this.props;
    const { lecture = {}, tab, editorState, content } = this.state;

    const contentItems = map(content, (item, index) => ({
      ...item,
      onDownload: this.onDownloadFile(item),
      onEdit: this.onEditContent(index),
      onDelete: this.onDeleteContent(index)
    }));
    return (
      <>
        <CustomNavbar
          component={<LectureTitle title={lecture && lecture.title} onChange={this.onChangeTitle} onBack={this.handleBack} />}
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
                  <Dropzone
                    accept="image/*"
                    multiple={false}
                    onDrop={acceptedFiles => {
                      this.dropFiles(acceptedFiles);
                    }}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <section>
                        <div {...getRootProps()} className={classes.dropzone}>
                          <input {...getInputProps()} />
                          <p>Drag n drop some files here, or click to select files</p>
                        </div>
                      </section>
                    )}
                  </Dropzone>
                </TabPanel>
                <TabPanel value={tab} index={1}>
                  <Editor
                    stripPastedStyles
                    editorState={editorState}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName={styles.wrapperClassName}
                    editorClassName={styles.wrapperClassName}
                    onEditorStateChange={this.onEditorStateChange}
                    editorStyle={{ height: 200, border: '1px solid #eee' }}
                    wrapperStyle={{ minHeight: 200, width: '60%', margin: 'auto', marginBottom: 24 }}
                  />
                  <Fab
                    className={classes.fabSave}
                    variant="extended"
                    color="default"
                    size="medium"
                    aria-label="like"
                    onClick={this.handleAddText}
                  >
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
              <SortableList items={contentItems} onSortEnd={this.onSortEnd} pressDelay={DND_DELAY} />
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
  signUrl: PropTypes.string,
  course: PropTypes.objectOf(PropTypes.any),
  getCourseAction: PropTypes.func.isRequired,
  getGignUrlAction: PropTypes.func.isRequired,
  createSectionAction: PropTypes.func.isRequired,
  createLectureAction: PropTypes.func.isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired
};

const mapStateToProps = ({ courses, files }) => ({
  course: courses.course,
  signUrl: files.signUrl
});

const mapDispatchToProps = dispatch => ({
  getGignUrlAction: data => {
    dispatch(getGignUrl(data));
  },
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
