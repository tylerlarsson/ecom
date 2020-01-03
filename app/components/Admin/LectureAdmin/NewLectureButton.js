import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ControlPoint from '@material-ui/icons/ControlPoint';

const useStyles = makeStyles({
  wrap: {
    width: '100%',
    border: '2px dashed #ddd',
    padding: 24,
    color: 'teal',
    cursor: 'pointer'
  },
  icon: {
    color: 'teal',
    marginRight: 16
  }
});

function NewLectureButton(props) {
  const classes = useStyles();

  return (
    <div className={classes.wrap} onClick={props.onSelect}>
      <ControlPoint className={classes.icon} /> Add new lecture
    </div>
  );
}

NewLectureButton.propTypes = {
  onSelect: PropTypes.func
};

export default NewLectureButton;
