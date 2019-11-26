import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map } from 'lodash';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import Fab from '@material-ui/core/Fab';
// core components
import Modal from 'components/Modal/Modal';
import GridItem from 'components/Grid/GridItem';
import GridContainer from 'components/Grid/GridContainer';
import AdminNavbar from 'components/Navbars/AdminNavbar';
import AdminContent from 'components/Content/AdminContent';
import routes from 'constants/routes.json';
import { getCourses } from 'redux/actions/courses';
import CardMedia from 'components/Card/CardMedia';
import image1 from 'assets/img/sidebar-1.jpg';
import image2 from 'assets/img/sidebar-2.jpg';
import image3 from 'assets/img/sidebar-3.jpg';
import image4 from 'assets/img/sidebar-4.jpg';
import defaultImage from 'assets/img/reactlogo.png';

const testData = [
  { id: 1, title: 'Course 1', sales: 13543.76, enrolled: 3000, image: image1 },
  { id: 2, title: 'Course 2', sales: 44543.76, enrolled: 13000, image: image2 },
  { id: 3, title: 'Course 3', sales: 543.76, enrolled: 20, image: image3 },
  { id: 4, title: 'Course 4', sales: 0, enrolled: 0, image: image4 }
];

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
    elevation: 1
  }
};

class Courses extends Component {
  componentWillMount() {
    const { getCoursesAction } = this.props;
    getCoursesAction();
  }

  handleAddNew = () => {
    const { history } = this.props;
    history.push(`${routes.ADMIN}${routes.NEW_COURSE}`);
  };

  renderNavbar = classes => (
    <Fab variant="extended" size="medium" aria-label="like" className={classes.fab} onClick={this.handleAddNew}>
      Add Course
    </Fab>
  );

  handleCoursePage = item => () => {
    const { history } = this.props;
    console.log('handleCoursePage', item);
    history.push(`${routes.ADMIN}${routes.CURRICULUM.replace(':course', item.id)}`);
  };

  render() {
    const { classes, data } = this.props;
    const courses = [...data, ...testData];

    return (
      <>
        <AdminNavbar title={`Courses (${courses.length})`} right={this.renderNavbar(classes)} />
        <AdminContent>
          <GridContainer>
            {map(courses, item => (
              <GridItem key={item.id} xs={12} sm={6} md={4} lg={3}>
                <CardMedia
                  defaultImage={defaultImage}
                  image={item.image}
                  title={item.title}
                  onClick={this.handleCoursePage(item)}
                  content={<div><span style={{marginRight: 24}}><b>${item.sales || 0}</b> sales</span> <span><b>{item.enrolled || 0}</b> enrolled</span></div>}
                />
              </GridItem>
            ))}
          </GridContainer>
        </AdminContent>
      </>
    );
  }
}

Courses.propTypes = {
  getCoursesAction: PropTypes.func.isRequired,
  data: PropTypes.array,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

const mapStateToProps = ({ courses }) => ({
  data: courses.courses.data,
  total: courses.courses.total
});

const mapDispatchToProps = dispatch => ({
  getCoursesAction: () => {
    dispatch(getCourses());
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Courses));
