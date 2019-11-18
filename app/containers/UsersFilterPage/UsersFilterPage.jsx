import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map, forEach, find, filter } from 'lodash';
import moment, * as moments from 'moment';
// @material-ui/core components
import 'date-fns';
import withStyles from '@material-ui/core/styles/withStyles';
import Fab from '@material-ui/core/Fab';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Link from '@material-ui/core/Link';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import Close from "@material-ui/icons/Close";
// core components
import Modal from 'components/Modal/Modal';
import GridItem from 'components/Grid/GridItem';
import GridContainer from 'components/Grid/GridContainer';
import TableList from 'components/Table/TableList';
import Card from 'components/Card/Card';
// import CardHeader from 'components/Card/CardHeader.jsx';
import CardBody from 'components/Card/CardBody';
import AdminNavbar from 'components/Navbars/AdminNavbar';
import AdminContent from 'components/Content/AdminContent';
import { getUsers, getFilters } from '../../redux/actions/users';

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
  filterContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  filterCard: {
    marginTop: 10,
    marginBottom: 10
  },
  closeBtn: {
    cursor: 'pointer'
  },
  label: {
    marginRight: 24
  }
};

class UsersFilterPage extends Component {
  state = {
    open: false,
    openConfirm: false,
    editId: null,
    deleteItem: null,
    name: '',
    description: '',
    role: {},
    selected: {},
    filtersValues: {}
  };

  componentWillMount() {
    this.setRole();
    this.props.getFiltersAction();
    this.getUsers();
  }

  componentDidUpdate(prevProps, prevState) {
    const { roles } = this.props;
    const { filtersValues } = this.state;

    if (prevProps.roles !== roles) {
      this.setRole();
    }
    if (prevState.filtersValues !== filtersValues) {
      this.getUsers();
    }
  }

  getUsers = () => {
    const { match } = this.props;
    const { filtersValues } = this.state;
    const roleName = match && match.params && match.params.role;
    if (roleName) {
      const payload = { params: { ...filtersValues, 'has-role': roleName } };

      this.props.getUsersAction(payload);
    }
  };

  setRole = () => {
    const { match, roles } = this.props;
    const roleName = match && match.params && match.params.role;
    const role = find(roles, item => item.name === roleName);

    if (role) {
      this.setState({ role });
    }
  };

  handleAddNew = () => {
    console.log('New Student');
  };

  handleExportCSV = () => {
    console.log('Export CSV');
  };

  handleCloseFilter = name => () => {
    const { selected, filtersValues } = this.state;
    selected[name] = false;
    filtersValues[name] = undefined;
    this.setState({ selected, filtersValues });
  };

  handleChange = event => {
    const { selected, filtersValues } = this.state;
    selected[event.target.value] = true;
    filtersValues[event.target.value] = '';
    this.setState({ selected, filtersValues });
  };

  resetFilters = () => {
    this.setState({ selected: {}, filtersValues: {} });
  };

  prepareData = data =>
    map(data, item => {
      const { roles, created, loginLast, loginCount, ...rest } = item;

      return {
        ...rest,
        roles: map(roles, p => p.name).join(', '),
        created: created && moment(created).format('YYYY-MM-DD HH:mm:ss'),
        loginLast: loginLast && moment(loginLast).format('YYYY-MM-DD HH:mm:ss'),
        loginCount
      };
    });

  prepareFilters = (data) => {
    return filter(data, item => !!item.type);
  };

  handleDateChange = field => value => {
    console.log('handleDateChange', field, value)
    const { filtersValues } = this.state;
    this.setState({ filtersValues: { ...filtersValues, [field]: value } });
  };

  handleInputChange = field => event => {
    console.log('handleInputChange', field, event.target.value)
    const { filtersValues } = this.state;
    this.setState({ filtersValues: { ...filtersValues, [field]: event.target.value }});
  };

  renderControl = (item) => {
    const { filtersValues } = this.state;
    const value = filtersValues[item];
    let control;

    switch (item.type) {
      case 'date':
        control = (
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-inline"
              value={value}
              onChange={this.handleDateChange(item.name)}
              KeyboardButtonProps={{
                'aria-label': 'change date'
              }}
            />
          </MuiPickersUtilsProvider>
        );
        break;
      case 'string':
        control = (
          <TextField
            name={item.name}
            value={value}
            onChange={this.handleInputChange(item.name)}
            placeholder="Input text"
          />
        );
        break;
      default:
        control = null;
    }

    return control;
  };

  renderNavbar = classes => (
    <>
      <Fab variant="extended" size="medium" aria-label="like" color="secondary" onClick={this.handleExportCSV}>
        Export CSV
      </Fab>
      <Fab variant="extended" size="medium" aria-label="like" className={classes.fab} onClick={this.handleAddNew}>
        Add Student
      </Fab>
    </>
  );

  render() {
    const { data, roles, filters, classes } = this.props;
    const { role, selected, filtersValues } = this.state;

    console.log('role', role, roles);
    console.log('filters', filters);
    console.log('selected', selected);
    console.log('filtersValues', filtersValues);
    return (
      <>
        <AdminNavbar title={role.description || ''} right={this.renderNavbar(classes)} />
        <AdminContent>
          <Card>
            <CardBody className={classes.filterContent}>
              <FormControl className={classes.formControl}>
                <Select onChange={this.handleChange} value="" displayEmpty disableUnderline>
                  <MenuItem value="">
                    Add Filter
                  </MenuItem>
                  {map(this.prepareFilters(filters), item => (<MenuItem key={item.name} value={item.name}>{item.label}</MenuItem>))}
                </Select>
              </FormControl>
              <Link onClick={this.resetFilters}>Reset Filters</Link>
            </CardBody>
          </Card>
          {map(filters, item => {
            if (selected[item.name]) {
              return (
                <Card className={classes.filterCard} key={item.name}>
                  <CardBody className={classes.filterContent}>
                    <div className={classes.filterContent}>
                      <div className={classes.label}>{item.label}</div>
                      <div>{this.renderControl(item)}</div>
                    </div>
                    <Close className={classes.closeBtn} onClick={this.handleCloseFilter(item.name)} />
                  </CardBody>
                </Card>
              )
            }
          })}
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardBody>
                  <TableList
                    tableHeaderColor="info"
                    tableHead={['Email', 'Roles', 'Created', 'Last Login', 'Login Count']}
                    tableColumns={['email', 'roles', 'created', 'loginLast', 'loginCount']}
                    tableData={this.prepareData(data)}
                  />
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </AdminContent>
      </>
    );
  }
}

UsersFilterPage.propTypes = {
  getUsersAction: PropTypes.func.isRequired,
  getFiltersAction: PropTypes.func.isRequired,
  roles: PropTypes.arrayOf(PropTypes.any).isRequired,
  data: PropTypes.array,
  total: PropTypes.number
};

const mapStateToProps = ({ users }) => ({
  roles: users.roles.data,
  filters: users.filters,
  data: users.users.data,
  total: users.users.total
});

const mapDispatchToProps = dispatch => ({
  getUsersAction: (data) => {
    dispatch(getUsers(data));
  },
  getFiltersAction: data => {
    dispatch(getFilters(data));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(UsersFilterPage));
