'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Typography,
  DialogProps,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';

export interface CustomDialogProps extends Omit<DialogProps, 'title'> {
  open: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  hideActions?: boolean;
}

const CustomDialog: React.FC<CustomDialogProps> = ({
  open,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = '확인',
  cancelText = '취소',
  hideActions = false,
  ...rest
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" {...rest}>
      {title && (
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <Typography variant="h6">{title}</Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
      )}

      <DialogContent dividers>{children}</DialogContent>

      {!hideActions && (
        <DialogActions>
          <Button onClick={onClose} color="inherit">
            {cancelText}
          </Button>
          {onConfirm && (
            <Button onClick={onConfirm} variant="contained" color="primary">
              {confirmText}
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default CustomDialog;
