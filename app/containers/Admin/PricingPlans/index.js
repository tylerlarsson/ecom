import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map, find } from 'lodash';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import {
  Paper,
  Typography,
  TextField,
  FormControl,
  TextareaAutosize,
  Fab,
  Button,
  MenuItem,
  Select
} from '@material-ui/core';
import { ChevronLeft } from '@material-ui/icons';
// core components
import GridItem from 'components/Grid/GridItem';
import GridContainer from 'components/Grid/GridContainer';
import AdminNavbar from 'components/Navbars/AdminNavbar';
import AdminContent from 'components/Content/AdminContent';
import CourseSteps from 'components/CourseAdmin/CourseSteps';
import { addPricingPlan, getPricingPlans } from 'redux/actions/courses';
import TableList from 'components/Table/TableList';
import { PRICING_PLAN_TYPES } from 'constants/default';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';

const styles = theme => ({
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
  title: {
    textAlign: 'center',
    marginBottom: 30
  },
  subtitle: {
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  wrapper: {
    width: '100%',
    padding: 40,
    position: 'relative'
  },
  plan: {
    cursor: 'pointer'
  },
  margin: {
    margin: theme.spacing(1),
    width: '100%'
  },
  marginRow: {
    margin: theme.spacing(1),
    width: 'auto',
    flexDirection: 'row',
    alignItems: 'center'
  },
  form: {
    width: '60%',
    margin: 'auto'
  },
  fab: {
    background: 'orange',
    margin: '20px auto 0 !important',
    width: '100% !important',
    display: 'block'
  },
  textarea: {
    padding: '20px 14px',
    borderRadius: 4
  },
  backIcon: {
    color: '#bbb',
    position: 'absolute',
    left: 10,
    top: 10,
    padding: 10,
    cursor: 'pointer'
  }
});

const initialState = {
  newPlan: null,
  price: 0,
  period: 1,
  paymentType: 'monthly',
  title: '',
  subtitle: '',
  description: ''
};
class PricingPlans extends Component {
  state = {
    ...initialState
  };

  componentWillMount() {
    const { match, getPricingPlansAction } = this.props;
    const courseId = match && match.params && match.params.course;

    getPricingPlansAction({ courseId });
  }

  handleAddNew = item => () => {
    this.setState({ newPlan: item });
  };

  handleAddPlan = (item = null) => {
    const { match, addPricingPlanAction } = this.props;
    const { newPlan, price, title, subtitle, description, period, paymentType } = this.state;
    const courseId = match && match.params && match.params.course;
    const plan = newPlan || item;
    const payload = {
      price: parseFloat(price),
      courseId,
      isRecurring: plan.isRecurring,
      purchaseUrl: 'url',
      title: title || plan.title,
      subtitle,
      description,
      period,
      paymentType,
      type: plan.type
    };

    addPricingPlanAction(payload);
    this.setState({ ...initialState });
  };

  onChange = field => event => {
    let value = event && event.target && event.target.value;

    if (field === 'period' && value < 1) {
      value = 1;
    }

    this.setState({ [field]: value });
  };

  closeForm = () => {
    this.setState({ ...initialState });
  };

  prepareData = data =>
    map(data, item => {
      const { _id, id, type, title, price, isRecurring } = item;
      const plan = find(PRICING_PLAN_TYPES, p => p.type === type);
      return {
        id: _id || id,
        type: plan.name || type,
        title,
        price,
        isRecurring: isRecurring ? 'Yes' : 'No',
        purchaseUrl: <Button>Copy</Button>
      };
    });

  renderNew = () => {
    const { classes } = this.props;
    const { newPlan, price, title, subtitle, description, period, paymentType } = this.state;
    const type = newPlan && newPlan.type;

    return (
      <div className={classes.form}>
        {type !== 'free' ? (
          <FormControl className={classes.margin}>
            <TextField
              fullwidth
              placeholder="Price"
              id="outlined-size-small"
              defaultValue="Small"
              variant="outlined"
              size="small"
              onChange={this.onChange('price')}
              value={price || ''}
            />
          </FormControl>
        ) : null}
        {type !== 'free' ? (
          <FormControl className={classes.marginRow}>
            <TextField
              style={{ width: 'auto', marginRight: 16 }}
              type="number"
              id="outlined-size-small"
              variant="outlined"
              size="small"
              onChange={this.onChange('period')}
              value={period}
            />
            <FormControl className={classes.formControl}>
              <Select
                defaultValue={paymentType}
                disableUnderline
                onChange={this.onChange('paymentType')}
                inputProps={{
                  name: 'paymentType',
                  id: 'payment-type'
                }}
              >
                <MenuItem value="monthly">monthly payments</MenuItem>
                <MenuItem value="yearly">yearly payments</MenuItem>
              </Select>
            </FormControl>
          </FormControl>
        ) : null}
        <FormControl className={classes.margin}>
          <TextField
            fullwidth
            placeholder="Title"
            id="outlined-size-small"
            variant="outlined"
            size="small"
            onChange={this.onChange('title')}
            value={title}
          />
        </FormControl>
        <FormControl className={classes.margin}>
          <TextField
            fullwidth
            placeholder="Subtitle"
            id="outlined-size-small"
            variant="outlined"
            size="small"
            onChange={this.onChange('subtitle')}
            value={subtitle}
          />
        </FormControl>
        <FormControl className={classes.margin}>
          <TextareaAutosize
            className={classes.textarea}
            fullwidth
            aria-label="empty textarea"
            placeholder="Description"
            rows={6}
            onChange={this.onChange('description')}
            value={description}
          />
        </FormControl>
        <FormControl className={classes.margin}>
          <Fab
            className={classes.fab}
            variant="extended"
            color="default"
            size="medium"
            aria-label="like"
            onClick={this.handleAddPlan}
          >
            Add Pricing
          </Fab>
        </FormControl>
      </div>
    );
  };

  render() {
    const { classes, plans, match } = this.props;
    const { newPlan } = this.state;
    const courseId = match && match.params && match.params.course;
    // prettier-ignore
    return (
      <>
        <AdminNavbar title="Pricing" />
        <AdminContent>
          <Paper classes={{ root: classes.wrapper }}>
            <Typography className={classes.title} variant="h6">
              {newPlan ? (
                <div className={classes.backIcon}>
                  <ChevronLeft onClick={this.closeForm} />
                </div>
              ) : null}
              New Pricing Plan
            </Typography>
            <GridContainer>
              {newPlan
                ? this.renderNew()
                : map(PRICING_PLAN_TYPES, item =>
                  (
                    <GridItem key={item.id} xs={12} sm={6} md={4} lg={3} onClick={this.handleAddNew(item)}>
                      <Typography className={classes.subtitle}>{item.name}</Typography>
                      <Typography>{item.description}</Typography>
                    </GridItem>
                  ))}
            </GridContainer>
          </Paper>
          {plans.length > 0 ? (
            <Card>
              <CardBody>
                <TableList
                  tableHeaderColor="info"
                  tableHead={['ID', 'Plan Type', 'Plan Name', 'Price', 'Recurring', 'Purchase Url']}
                  tableColumns={['id', 'type', 'title', 'price', 'isRecurring', 'purchaseUrl']}
                  tableData={this.prepareData(plans)}
                  // total={plans.length}
                  // pagination={pagination}
                  // onChangePage={this.changePage}
                />
              </CardBody>
            </Card>
          ) : null}
        </AdminContent>
        <CourseSteps active={3} courseId={courseId} />
      </>
    );
  }
}

PricingPlans.propTypes = {
  addPricingPlanAction: PropTypes.func.isRequired,
  getPricingPlansAction: PropTypes.func.isRequired,
  plans: PropTypes.arrayOf(PropTypes.any),
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  match: PropTypes.objectOf(PropTypes.any).isRequired
};

const mapStateToProps = ({ courses }) => ({
  plans: courses.pricingPlans
});

const mapDispatchToProps = dispatch => ({
  getPricingPlansAction: data => {
    dispatch(getPricingPlans(data));
  },
  addPricingPlanAction: data => {
    dispatch(addPricingPlan(data));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(PricingPlans));
