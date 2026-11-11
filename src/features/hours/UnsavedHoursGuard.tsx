import { useBlocker } from 'react-router';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useInvalidInputs } from './invalidInputsContext';

export const UnsavedHoursGuard = () => {
  const { invalidInputs, hasInvalid } = useInvalidInputs();
  const blocker = useBlocker(hasInvalid);

  if (blocker.state !== 'blocked') {
    return null;
  }

  const fixFirst = () => {
    blocker.reset();
    requestAnimationFrame(() => invalidInputs[0]?.focus());
  };

  return (
    <Dialog open onClose={fixFirst} disableRestoreFocus>
      <DialogTitle>Godziny nie zostały zapisane</DialogTitle>
      <DialogContent>
        <DialogContentText component="div">
          Popraw zaznaczone pola, zanim przejdziesz dalej:
          <ul>
            {invalidInputs.map((input, index) => (
              <li key={index}>{input.label}</li>
            ))}
          </ul>
          Jeśli przejdziesz dalej, te wartości przepadną.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={() => blocker.proceed()}>
          Odrzuć i przejdź
        </Button>
        <Button variant="contained" onClick={fixFirst} autoFocus>
          Popraw
        </Button>
      </DialogActions>
    </Dialog>
  );
};
