import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map } from 'lodash';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import { Paper, Typography } from '@material-ui/core';
// core components
import GridItem from 'components/Grid/GridItem';
import GridContainer from 'components/Grid/GridContainer';
import AdminNavbar from 'components/Navbars/AdminNavbar';
import AdminContent from 'components/Content/AdminContent';
import routes from 'constants/routes.json';
import { getCourses } from 'redux/actions/courses';

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
  },
  title: {
    textAlign: 'center'
  },
  wrapper: {
    wisth: '100%'
  }
};

const planTypes = [
  { id: 1, type: 'free', name: 'Free', description: 'No Payments' },
  { id: 2, type: 'subscription', name: 'Subscription', description: 'Montly or Annual Billing' },
  { id: 3, type: 'one-time ', name: 'One-Time Purchase', description: 'A Single Payment' },
  { id: 4, type: 'plan', name: 'Payment Plan', description: 'A Fixed Number of Payments' }
];

class PricingPlans extends Component {
  componentWillMount() {
    const { getCoursesAction } = this.props;
    getCoursesAction();
  }

  handleAddNew = () => {
    const { history } = this.props;
    history.push(`${routes.ADMIN}${routes.NEW_COURSE}`);
  };

  handleCoursePage = item => () => {
    const { history } = this.props;
    console.log('handleCoursePage', item);
    history.push(`${routes.ADMIN}${routes.CURRICULUM.replace(':course', item.id)}`);
  };

  render() {
    const { classes, data } = this.props;
    const courses = [...data];

    return (
      <>
        <AdminNavbar title="Pricing" />
        <AdminContent>
          <GridContainer>
            <Paper classes={{ root: classes.wrapper }}>
              <Typography className={classes.title}>New Pricing Plan</Typography>
              {map(planTypes, item => (
                <GridItem key={item.id} xs={12} sm={6} md={4} lg={3}>
                  <Typography>{item.name}</Typography>
                  <Typography>{item.description}</Typography>
                </GridItem>
              ))}
            </Paper>
          </GridContainer>
        </AdminContent>
      </>
    );
  }
}

PricingPlans.propTypes = {
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
)(withStyles(styles)(PricingPlans));
