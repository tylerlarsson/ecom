import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { forEach, find, size, filter } from 'lodash';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import Fab from '@material-ui/core/Fab';
import TextField from '@material-ui/core/TextField';
// core components
import Modal from 'components/Modal/Modal';
import GridItem from 'components/Grid/GridItem.jsx';
import GridContainer from 'components/Grid/GridContainer.jsx';
import TableList from 'components/Table/TableList';
import Card from 'components/Card/Card.jsx';
// import CardHeader from 'components/Card/CardHeader.jsx';
import CardBody from 'components/Card/CardBody';
import AdminNavbar from 'components/Navbars/AdminNavbar';
import AdminContent from 'components/Content/AdminContent';
import { getRole, createRole, deleteRole } from 'redux/actions/users';
import routes from 'constants/routes.json';

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
    marginLeft: 17
  }
};

class Role extends Component {
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
    this.setRole();
  }

  componentDidUpdate(prevProps) {
    const { roles } = this.props;

    if (prevProps.roles !== roles) {
      this.setRole();
    }
  }

  setRole = () => {
    const { match, roles } = this.props;
    const roleName = match && match.params && match.params.name;
    const role = find(roles, item => item.name === roleName);

    if (role) {
      const selected = {};
      forEach(role.permissions, p => {
        selected[p.name] = true;
      });
      this.setState({ id: role.id, name: role.name, description: role.description, selected });
    }
  };

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

  renderNavbar = classes => (
    <>
      <Fab variant="extended" size="medium" aria-label="like" color="secondary" className={classes.fab} onClick={this.handleBack}>
        Cancel
      </Fab>
      <Fab variant="extended" size="medium" aria-label="like" color="primary" className={classes.fab} onClick={this.handleSave}>
        Save
      </Fab>
    </>
  );

  render() {
    const { classes, roles, permissions } = this.props;
    const { selected, name, description } = this.state;

    console.log('role', roles, permissions);
    console.log('selected', selected);

    return (
      <>
        <AdminNavbar title="Role" right={this.renderNavbar(classes)} />
        <AdminContent>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardBody>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    name="name"
                    label="Name"
                    type="text"
                    fullWidth
                    value={name}
                    disabled
                    onChange={this.onChange('name')}
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    id="description"
                    name="description"
                    label="Description"
                    type="text"
                    fullWidth
                    value={description}
                    onChange={this.onChange('description')}
                  />
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <TableList
                    tableHeaderColor="info"
                    tableHead={['Name', 'Description']}
                    tableColumns={['name', 'description']}
                    tableData={permissions}
                    selected={selected}
                    onSelect={this.onSelect}
                    onSelectAll={this.onSelectAll}
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

Role.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  getRoleAction: PropTypes.func.isRequired,
  createRoleAction: PropTypes.func.isRequired,
  role: PropTypes.objectOf(PropTypes.any).isRequired,
  roles: PropTypes.arrayOf(PropTypes.any).isRequired,
  permissions: PropTypes.arrayOf(PropTypes.any).isRequired,
  permissionsTotal: PropTypes.number.isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  match: PropTypes.objectOf(PropTypes.any).isRequired
};

const mapStateToProps = ({ users }) => ({
  role: users.role,
  permissions: users.permissions.data,
  permissionsTotal: users.permissions.total,
  roles: users.roles.data
});

const mapDispatchToProps = dispatch => ({
  getRoleAction: name => {
    dispatch(getRole(name));
  },
  createRoleAction: data => {
    dispatch(createRole(data));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Role));
