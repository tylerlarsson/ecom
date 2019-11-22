import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map, find, filter, forEach } from 'lodash';
import moment, * as moments from 'moment';
import { CSVLink } from 'react-csv/lib';
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
import Close from '@material-ui/icons/Close';
// core components
import GridItem from 'components/Grid/GridItem';
import GridContainer from 'components/Grid/GridContainer';
import TableList from 'components/Table/TableList';
import Card from 'components/Card/Card';
// import CardHeader from 'components/Card/CardHeader.jsx';
import CardBody from 'components/Card/CardBody';
import AdminNavbar from 'components/Navbars/AdminNavbar';
import AdminContent from 'components/Content/AdminContent';
import { getUsers, getFilters } from 'redux/actions/users';
import { PAGINATION } from 'constants/default';

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
  },
  csvLink: {
    textDecoration: 'none'
  }
};

class UsersFilterPage extends Component {
  state = {
    role: {},
    selected: {},
    filtersValues: {},
    pagination: PAGINATION
  };

  componentWillMount() {
    this.setRole();
    this.props.getFiltersAction();
    this.getUsers();
  }

  componentDidUpdate(prevProps, prevState) {
    const { roles, match } = this.props;
    const { filtersValues, role } = this.state;

    if (prevProps.roles !== roles || prevProps.match.url !== match.url) {
      this.setRole();
    }
    if (prevState.filtersValues !== filtersValues || prevState.role !== role) {
      this.getUsers();
    }
  }

  getUsers = () => {
    const { match, filters } = this.props;
    const { filtersValues, selected, pagination } = this.state;
    const roleName = match && match.params && match.params.role;
    if (roleName) {
      const filtersPayload = {};
      forEach(filters, item => {
        if (selected[item.name]) {
          if (item.type === 'date') {
            filtersPayload[item.name] = Math.round(new Date(filtersValues[item.name]).getTime() / 1000);
          } else {
            filtersPayload[item.name] = filtersValues[item.name];
          }
        }
      });
      const payload = { params: { ...filtersPayload, 'has-role': roleName }, pagination };
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

  handleCloseFilter = name => () => {
    const { selected, filtersValues } = this.state;
    this.setState({ selected: { ...selected, [name]: false }, filtersValues: { ...filtersValues, [name]: undefined } });
  };

  handleAddFilter = event => {
    const { selected, filtersValues } = this.state;
    const { filters } = this.props;
    const currentFilter = find(filters, item => item.name === event.target.value);
    let value = '';

    if (currentFilter) {
      switch (currentFilter.type) {
        case 'boolean':
          value = true;
          break;
        case 'number':
          value = 0;
          break;
        case 'date':
          value = new Date();
          break;
        default:
          value = '';
      }
    }

    this.setState({
      selected: { ...selected, [event.target.value]: true },
      filtersValues: { ...filtersValues, [event.target.value]: value }
    });
  };

  resetFilters = () => {
    this.setState({ selected: {}, filtersValues: {} });
  };

  prepareData = data =>
    map(data, item => {
      const { roles, created, loginLast, loginCount, firstname, lastname, ...rest } = item;

      return {
        ...rest,
        firstname: firstname || '',
        lastname: lastname || '',
        roles: map(roles, p => p.name).join(', '),
        created: created && moment(created).format('YYYY-MM-DD HH:mm:ss'),
        loginLast: loginLast && moment(loginLast).format('YYYY-MM-DD HH:mm:ss'),
        loginCount
      };
    });

  prepareFilters = data => {
    return filter(data, item => !!item.type);
  };

  handleDateChange = field => value => {
    const { filtersValues } = this.state;
    this.setState({ filtersValues: { ...filtersValues, [field]: value } });
  };

  handleInputChange = field => event => {
    const { filtersValues } = this.state;
    this.setState({ filtersValues: { ...filtersValues, [field]: event.target.value }});
  };

  changePage = pagination => {
    this.setState({ pagination }, () => {
      this.getUsers();
    });
  };

  renderControl = item => {
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
      case 'number':
        control = (
          <TextField
            name={item.name}
            value={value}
            onChange={this.handleInputChange(item.name)}
            placeholder="Input number"
            type="number"
          />
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

  renderNavbar = () => {
    const { classes, data } = this.props;
    const { role } = this.state;
    const filename = `${role.name}-${moment().format('MM-DD-YYYY')}.csv`;

    return (
      <>
        <CSVLink data={this.prepareData(data)} filename={filename} className={classes.csvLink}>
          <Fab variant="extended" size="medium" aria-label="like" color="secondary">
            Export CSV
          </Fab>
        </CSVLink>

        <Fab variant="extended" size="medium" aria-label="like" className={classes.fab} onClick={this.handleAddNew}>
          Add {role.description}
        </Fab>
      </>
    );
  }

  render() {
    const { data, filters, classes, total } = this.props;
    const { role, selected, pagination } = this.state;

    return (
      <>
        <AdminNavbar title={role.description || ''} right={this.renderNavbar()} />
        <AdminContent>
          <Card>
            <CardBody className={classes.filterContent}>
              <FormControl className={classes.formControl}>
                <Select onChange={this.handleAddFilter} value="" displayEmpty disableUnderline>
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
                    tableHead={['Email', 'First Name', 'Last Name', 'Roles', 'Created', 'Last Login', 'Login Count']}
                    tableColumns={['email', 'firstname', 'lastname', 'roles', 'created', 'loginLast', 'loginCount']}
                    tableData={this.prepareData(data)}
                    total={total}
                    pagination={pagination}
                    onChangePage={this.changePage}
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
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  roles: PropTypes.arrayOf(PropTypes.any).isRequired,
  filters: PropTypes.array,
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
  getUsersAction: data => {
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
