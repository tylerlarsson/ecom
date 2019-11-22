import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { forEach, map, size, filter } from 'lodash';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import Fab from '@material-ui/core/Fab';
import {
  TextField,
  Typography,
  FormLabel,
  FormControl,
  Box,
  Select,
  MenuItem
} from '@material-ui/core';
// core components
import GridItem from 'components/Grid/GridItem';
import GridContainer from 'components/Grid/GridContainer';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import AdminNavbar from 'components/Navbars/AdminNavbar';
import AdminContent from 'components/Content/AdminContent';
import { createCourse } from 'redux/actions/courses';
import routes from 'constants/routes.json';
import { getUsers } from 'redux/actions/users';
import NewLectureButton from 'components/Lecture/NewLectureButton';
import Section from 'components/Course/Section';
import Lecture from 'components/Lecture/Lecture';

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
    justifyContent: 'flex-end',
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
      id: '',
      name: '',
      description: '',
      selected: {},
    };
  }

  componentWillMount() {
    // TODO check step and redirect
    this.props.getUsersAction();
  }

  handleBack = () => {
    const { history } = this.props;

    history.push(`${routes.ADMIN}${routes.ROLES}`);
  };

  handleSave = () => {
    const { id, name, description, selected } = this.state;
    const { createRoleAction } = this.props;
    const permissions = [];

    forEach(selected, (item, key) => {
      console.log(item, key)
      if (selected[key]) {
        permissions.push(key);
      }
    })

    const payload = { id, name, description, permissions };

    console.log('handleSave', payload);
    createRoleAction(payload);
    this.handleBack();
  };

  onSelect = item => e => {
    const { selected } = this.state;

    this.setState({ selected: { ...selected, [item.name]: !!!selected[item.name] } });
  };

  onSelectAll = () => {
    const { permissions } = this.props;
    const { selected } = this.state;
    const numSelected = size(filter(selected, s => !!s));
    const value = numSelected !== permissions.length;
    const newSelected = {};
    forEach(permissions, p => {
      newSelected[p.name] = value;
    });
    console.log('onSelectAll', numSelected, value, newSelected)
    this.setState({ selected: newSelected });
  };

  onChange = field => event => {
    this.setState({ [field]: event.target.value });
  };

  handleCreateCourse = () => {
    const { createCourseAction } = this.props;
    const { title, subtitle, author } = this.state;

    if (title && subtitle && author ) {
      const payload = {
        title,
        subtitle,
        authors: [
          author
        ]
      };
      console.log('payload', payload);
      createCourseAction(payload);
    }
  };

  renderNavbar = classes => (
    <>
      <Fab variant="extended" color="default" size="medium" aria-label="like" onClick={this.handleAddNew}>
        preview
      </Fab>
      <Fab variant="extended" size="medium" aria-label="like" className={classes.fab} onClick={this.handleAddNew}>
        New Section
      </Fab>
    </>
  );

  onNewLecture = () => {
    // TODO Create lecture
    console.log('onNewLecture');
  };

  onCheckSection = () => {
    // TODO
    console.log('onCheckSection');
  };

  onChangeSection = () => {
    // TODO
    console.log('onChangeSection');
  };

  render() {
    const { classes, users } = this.props;
    const { title, subtitle, author } = this.state;

    return (
      <>
        <AdminNavbar title="Curriculum" right={this.renderNavbar(classes)} />
        <AdminContent>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card className={classes.card}>
                <CardBody>
                  <Section
                    onChange={this.onChangeSection}
                    title="First Section"
                    checked={false}
                    onCheck={this.onCheckSection}
                  />
                  <Lecture
                    onChange={this.onChangeSection}
                    title="First Lecture"
                    checked={false}
                    onCheck={this.onCheckSection}
                  />
                  <NewLectureButton onSelect={this.onNewLecture} />
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </AdminContent>
      </>
    );
  }
}

CourseCurriculum.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  createCourseAction: PropTypes.func.isRequired,
  getUsersAction: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(PropTypes.any).isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired
};

const mapStateToProps = ({ users }) => ({
  users: users.users.data
});

const mapDispatchToProps = dispatch => ({
  getUsersAction: () => {
    dispatch(getUsers());
  },
  createCourseAction: data => {
    dispatch(createCourse(data));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(CourseCurriculum));
