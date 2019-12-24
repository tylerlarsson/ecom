import React from 'react';
import PropTypes from 'prop-types';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import { Button } from '@material-ui/core';

const styles = theme => ({
  button: {
    // margin: theme.spacing(3, 0, 2),
    color: theme.palette.primary.inverse,
    background: theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: 20,
    fontSize: 14,
    fontWeight: 'normal',
    height: 40,
    width: 'auto',
    lineHeight: '40px',
    padding: '0 38px',
    minWidth: 140,
    textTransform: 'capitalize',
    '&:hover': {
      color: theme.palette.primary.inverse,
      backgroundColor: theme.palette.primary.main
    }
  },
  buttonOutlined: {
    // margin: theme.spacing(3, 0, 2),
    color: theme.palette.primary.main,
    background: theme.palette.primary.inverse,
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: 20,
    fontSize: 14,
    fontWeight: 'normal',
    height: 40,
    width: 'auto',
    lineHeight: '40px',
    padding: '0 38px',
    minWidth: 140,
    textTransform: 'capitalize',
    '&:hover': {
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.inverse
    }
  }
});
const ButtonComponent = ({ classes, children, outlined, ...props }) => (
  <Button
    disableElevation
    variant="contained"
    classes={{ root: outlined ? classes.buttonOutlined : classes.button }}
    {...props}
  >
    {children}
  </Button>
);
ButtonComponent.propTypes = {
  outlined: PropTypes.bool,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  children: PropTypes.objectOf(PropTypes.any)
};
export default withStyles(styles)(ButtonComponent);
