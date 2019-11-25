import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import MoreVert from '@material-ui/icons/MoreVert';
import Edit from '@material-ui/icons/Edit';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
  wrap: {
    width: '100%',
    display: 'flex',
    padding: 24,
    background: '#eee',
    borderLeft: '3px solid orange',
    alignItems: 'center',
    marginBottom: 24,
    cursor: 'pointer',
    color: 'teal'
  },
  icon: {
    marginRight: 16,
    color: '#aaa'
  }
});

function Lecture(props) {
  const classes = useStyles();
  const { onChange, checked, onCheck, title } = props;

  return (
    <div className={classes.wrap}>
      <MoreVert className={classes.icon} />
      <FormControlLabel control={<Checkbox checked={checked} onChange={onCheck} value="checkedF" />} label={title} />
      <Edit className={classes.icon} onClick={onChange} />
      <Button variant="contained" disabled color="secondary">
        Draft
      </Button>
    </div>
  );
}

Lecture.propTypes = {
  title: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  onCheck: PropTypes.func
};

export default Lecture;
