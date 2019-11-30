import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Edit, ChevronLeft, Done, Close } from '@material-ui/icons';
import { withStyles, FormControl, FormControlLabel, Checkbox, TextField, Typography } from '@material-ui/core';

const styles = {
  wrap: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
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
    marginRight: 16,
    color: '#aaa'
  },
  iconEdit: {
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

class LectureTitle extends Component {
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
    const { classes } = this.props;
    const { isEdit, title } = this.state;

    return (
      <div className={classes.wrap}>
        <ChevronLeft className={classes.icon} />
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
            <Typography>{title}</Typography>
            <Edit className={classes.iconEdit} onClick={this.onHandleEdit} />
          </>
        )}
      </div>
    );
  }
}

LectureTitle.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  title: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  onCheck: PropTypes.func
};

export default withStyles(styles)(LectureTitle);
