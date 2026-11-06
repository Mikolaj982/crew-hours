import { Button, Snackbar } from '@mui/material';

export type UndoMessage = {
  text: string;
  onUndo: () => void;
};

type UndoSnackbarProps = {
  message: UndoMessage | null;
  onClose: () => void;
};

export const UndoSnackbar = ({ message, onClose }: UndoSnackbarProps) => {
  return (
    <Snackbar
      open={message !== null}
      autoHideDuration={6000}
      onClose={(_event, reason) => {
        if (reason !== 'clickaway') {
          onClose();
        }
      }}
      message={message?.text}
      sx={{ bottom: { xs: 72, md: 24 } }}
      action={
        <Button
          color="inherit"
          size="small"
          sx={{ fontWeight: 'bold' }}
          onClick={() => {
            message?.onUndo();
            onClose();
          }}
        >
          Cofnij
        </Button>
      }
    />
  );
};
