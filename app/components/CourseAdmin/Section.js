import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Edit, MoreVert, Done, Close } from '@material-ui/icons';
import { withStyles, FormControl, FormControlLabel, Checkbox, TextField } from '@material-ui/core';
import { sortableHandle } from 'react-sortable-hoc';

const styles = {
  wrap: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    paddingBottom: 24,
    cursor: 'pointer',
    height: 44
  },
  fieldWrap: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    paddingBottom: 24,
    cursor: 'pointer'
  },
  icon: {
    marginLeft: 16,
    color: '#aaa'
  },
  iconDone: {
    marginLeft: 16,
    color: 'green'
  },
  iconClose: {
    marginLeft: 16,
    color: 'red'
  }
};

const DragHandle = sortableHandle(() => <MoreVert style={{ color: '#aaa', marginRight: 16 }} />);

class Section extends Component {
  state = {
    isEdit: false,
    title: this.props.title
  };

  onHandleEdit = () => {
    this.setState({ isEdit: true });
  };

  onHandleSave = () => {
    const { title } = this.state;
    this.setState({ isEdit: false });
    this.props.onChange(title);
  };

  onHandleCancel = () => {
    this.setState({ isEdit: false });
  };

  onChange = event => {
    this.setState({ title: event.target.value });
  };

  render() {
    const { classes, checked, onCheck } = this.props;
    const { isEdit, title } = this.state;

    return (
      <div className={classes.wrap}>
        <DragHandle />
        {isEdit ? (
          <>
            <FormControl>
              <TextField value={title} onChange={this.onChange} />
            </FormControl>
            <Done className={classes.iconDone} onClick={this.onHandleSave} />
            <Close className={classes.iconClose} onClick={this.onHandleCancel} />
          </>
        ) : (
          <>
            <FormControlLabel
              control={<Checkbox checked={checked} onChange={onCheck} value="checkedF" />}
              label={title}
            />
            <Edit className={classes.icon} onClick={this.onHandleEdit} />
          </>
        )}
      </div>
    );
  }
}

Section.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  title: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  onCheck: PropTypes.func
};

export default withStyles(styles)(Section);
