import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function FormDialog(props) {
  const { open, onClose, onSubmit, title, description, maxWidth, children, okTitle } = props;

  return (
    <div>
      <Dialog maxWidth={maxWidth} open={open} onClose={onClose} aria-labelledby="form-dialog-title">
        {title ? <DialogTitle id="form-dialog-title">{title}</DialogTitle> : null}
        <DialogContent>
          {description ? <DialogContentText>{description}</DialogContentText> : null}
          {children}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={onSubmit} color="primary">
            {okTitle || 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

FormDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  title: PropTypes.string,
  description: PropTypes.string,
  maxWidth: PropTypes.number,
  children: PropTypes.object,
  okTitle: PropTypes.string
};

export default FormDialog;
