import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import MoreVert from '@material-ui/icons/MoreVert';
import Edit from '@material-ui/icons/Edit';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const useStyles = makeStyles({
  wrap: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    paddingBottom: 24,
    cursor: 'pointer'
  },
  icon: {
    marginRight: 16,
    color: '#aaa'
  }
});

function Section(props) {
  const classes = useStyles();
  const { onChange, checked, onCheck, title } = props;

  return (
    <div className={classes.wrap}>
      <MoreVert className={classes.icon} />
      <FormControlLabel control={<Checkbox checked={checked} onChange={onCheck} value="checkedF" />} label={title} />
      <Edit className={classes.icon} onClick={onChange} />
    </div>
  );
}

Section.propTypes = {
  title: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  onCheck: PropTypes.func
};

export default Section;
