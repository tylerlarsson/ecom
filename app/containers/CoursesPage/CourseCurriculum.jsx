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
import CardFooter from 'components/Card/CardFooter';
import AdminNavbar from 'components/Navbars/AdminNavbar';
import AdminContent from 'components/Content/AdminContent';
import { createCourse } from 'redux/actions/courses';
import routes from 'constants/routes.json';
import { getUsers } from 'redux/actions/users';

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
    background: 'orange'
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

  render() {
    const { classes, users } = this.props;
    const { title, subtitle, author } = this.state;

    return (
      <>
        <AdminNavbar title="New Course" />
        <AdminContent>
          <GridContainer>
            <GridItem xs={12} sm={3} md={4}>
              <Typography component="div" classes={{ root: classes.subtitle }}>
                <Box fontSize={18} fontWeight={500}>
                  Information
                </Box>
              </Typography>
              <Typography component="div">
                <Box fontSize={16} fontFamily="fontFamily">
                  Add basic information about the course and author name
                </Box>
              </Typography>
            </GridItem>
            <GridItem xs={12} sm={9} md={8}>
              <Card className={classes.card}>
                <CardBody>
                  <FormControl variant="outlined" fullWidth className={classes.formControl}>
                    <FormLabel component="legend">Course Title</FormLabel>
                    <TextField
                      autoFocus
                      margin="normal"
                      id="title"
                      name="name"
                      type="text"
                      fullWidth
                      value={title}
                      variant="outlined"
                      onChange={this.onChange('title')}
                    />
                  </FormControl>
                  <FormControl variant="outlined" fullWidth className={classes.formControl}>
                    <FormLabel component="legend">Course Subtitle</FormLabel>
                    <TextField
                      autoFocus
                      margin="normal"
                      id="description"
                      name="subtitle"
                      type="text"
                      fullWidth
                      variant="outlined"
                      value={subtitle}
                      onChange={this.onChange('subtitle')}
                    />
                  </FormControl>
                  <FormControl variant="outlined" fullWidth className={classes.formControl}>
                    <FormLabel component="legend" className={classes.selectLabel}>Select Author</FormLabel>
                    <Select onChange={this.onChange('author')}>
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {map(users, item => (
                        <MenuItem value={item.email}>{item.email}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </CardBody>
                <CardFooter className={classes.footer}>
                  <Fab variant="extended" size="medium" aria-label="like" className={classes.fab} onClick={this.handleCreateCourse}>
                    Create Course
                  </Fab>
                </CardFooter>
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
