import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function FormDialog(props) {
  const { open, onClose, onSubmit, title, description, maxWidth, children, okTitle } = props;

  return (
    <div>
      <Dialog maxWidth={maxWidth} open={open} onClose={onClose} aria-labelledby="form-dialog-title">
        {title ? <DialogTitle id="form-dialog-title">{title}</DialogTitle> : null }
        <DialogContent>
          {description ? (
            <DialogContentText>
              {description}
            </DialogContentText>
          )
            : null
          }
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
