import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map } from 'lodash';
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
import routes from 'constants/routes.json';
import { getRoles, createRole, deleteRole } from 'redux/actions/users';

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

class Roles extends Component {
  state = {
    open: false,
    openConfirm: false,
    editId: null,
    deleteItem: null,
    name: '',
    description: ''
  };

  handleAddNew = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false, openConfirm: false, name: '', description: '', editId: null, deleteItem: null });
  };

  handleSubmit = () => {
    const { name, description, editId } = this.state;
    const { createRoleAction } = this.props;
    const payload = { name, description };

    if (editId) {
      payload.id = editId;
    }

    createRoleAction(payload);
    this.handleClose();
  };

  onChange = field => event => {
    this.setState({ [field]: event.target.value });
  };

  handleDelete = item => {
    this.setState({ openConfirm: true, deleteItem: item });
  };

  handleEdit = item => {
    const { history } = this.props;

    history.push(`${routes.ADMIN}${routes.ROLE}`.replace(':name', item.name));
  };

  handleDeleteConfirmed = () => {
    const { deleteItem } = this.state;
    const { deleteRoleAction } = this.props;
    if (deleteItem) {
      deleteRoleAction({ name: deleteItem.name });
      this.handleClose();
    }
  };

  prepareData = data =>
    map(data, item => {
      const { permissions, ...rest } = item;

      return { ...rest, permissions: map(permissions, p => p.name).join(', ') };
    });

  renderConfirm = () => {
    const { openConfirm } = this.state;

    return (
      <Modal
        open={openConfirm}
        maxWidth="md"
        onClose={this.handleClose}
        onSubmit={this.handleDeleteConfirmed}
        description="Are you sure you want to delete this element?"
        okTitle="Delete"
      />
    );
  };

  renderNavbar = classes => (
    <Fab variant="extended" size="medium" aria-label="like" className={classes.fab} onClick={this.handleAddNew}>
      Add Role
    </Fab>
  );

  renderModal = () => {
    const { open, name, description } = this.state;

    return (
      <Modal
        open={open}
        maxWidth="md"
        onClose={this.handleClose}
        onSubmit={this.handleSubmit}
        title="Add New Role"
        okTitle="Save"
      >
        <TextField
          autoFocus
          margin="dense"
          id="name"
          name="name"
          label="Name"
          type="text"
          fullWidth
          value={name}
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
      </Modal>
    );
  };

  render() {
    const { classes, data } = this.props;

    return (
      <>
        <AdminNavbar title="Roles" right={this.renderNavbar(classes)} />
        <AdminContent>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardBody>
                  <TableList
                    tableHeaderColor="info"
                    tableHead={['Name', 'Description', 'Permissions']}
                    tableColumns={['name', 'description', 'permissions']}
                    tableData={this.prepareData(data)}
                    deleteAction={this.handleDelete}
                    editAction={this.handleEdit}
                  />
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </AdminContent>
        {this.renderModal()}
        {this.renderConfirm()}
      </>
    );
  }
}

Roles.propTypes = {
  getRolesAction: PropTypes.func,
  createRoleAction: PropTypes.func,
  deleteRoleAction: PropTypes.func,
  data: PropTypes.array,
  history: PropTypes.object
};

const mapStateToProps = ({ users }) => ({
  data: users.roles.data,
  total: users.roles.total
});

const mapDispatchToProps = dispatch => ({
  getRolesAction: () => {
    dispatch(getRoles());
  },
  createRoleAction: data => {
    dispatch(createRole(data));
  },
  deleteRoleAction: data => {
    dispatch(deleteRole(data));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Roles));
