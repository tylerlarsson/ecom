import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
import CardBody from 'components/Card/CardBody.jsx';
import AdminNavbar from 'components/Navbars/AdminNavbar';
import AdminContent from 'components/Content/AdminContent';
import { getPermissions, createPermission, deletePermission } from '../../redux/actions/users';

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

class Permissions extends Component {
  state = {
    open: false,
    openConfirm: false,
    editId: null,
    deleteItem: null,
    name: '',
    description: ''
  };

  componentDidMount() {
    this.props.getPermissionsAction();
  }

  handleAddNew = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false, openConfirm: false, name: '', description: '', editId: null, deleteItem: null });
  };

  handleSubmit = () => {
    const { name, description, editId } = this.state;
    const { createPermissionAction } = this.props;
    const payload = { name, description };

    if (editId) {
      payload.id = editId;
    }

    createPermissionAction(payload);
    this.handleClose();
  };

  onChange = field => event => {
    this.setState({ [field]: event.target.value });
  };

  handleDelete = item => {
    this.setState({ openConfirm: true, deleteItem: item });
  };

  handleDeleteConfirmed = () => {
    const { deleteItem } = this.state;
    const { deletePermissionAction } = this.props;
    if (deleteItem) {
      deletePermissionAction({ name: deleteItem.name });
      this.handleClose();
    }
  };

  handleEdit = item => {
    this.setState({ open: true, name: item.name, editId: item.id, description: item.description });
  };

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
      Add Permission
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
        title="Add New Permission"
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
        <AdminNavbar title="Permissions" right={this.renderNavbar(classes)} />
        <AdminContent>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardBody>
                  <TableList
                    tableHeaderColor="info"
                    tableHead={['Name', 'Description']}
                    tableColumns={['name', 'description']}
                    tableData={data}
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

Permissions.propTypes = {
  getPermissionsAction: PropTypes.func,
  createPermissionAction: PropTypes.func,
  deletePermissionAction: PropTypes.func,
  data: PropTypes.array,
  total: PropTypes.number
};

const mapStateToProps = ({ users }) => ({
  data: users.permissions.data,
  total: users.permissions.total
});

const mapDispatchToProps = dispatch => ({
  getPermissionsAction: () => {
    dispatch(getPermissions());
  },
  createPermissionAction: data => {
    dispatch(createPermission(data));
  },
  deletePermissionAction: data => {
    dispatch(deletePermission(data));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Permissions));
