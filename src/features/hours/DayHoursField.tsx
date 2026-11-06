import { TextField } from '@mui/material';
import { useHoursInput } from './useHoursInput';

type DayHoursFieldProps = {
  label: string;
  employeeId: string;
  siteId: string;
  date: string;
  savedHours: number | undefined;
};

export const DayHoursField = ({ label, ...entry }: DayHoursFieldProps) => {
  const { text, setText, error, isPending, save, blurOnEnter } =
    useHoursInput(entry);

  return (
    <TextField
      label={label}
      value={text}
      onChange={(event) => setText(event.target.value)}
      onBlur={save}
      onKeyDown={blurOnEnter}
      error={error !== null}
      helperText={error ?? (isPending ? 'Zapisywanie...' : ' ')}
      fullWidth
      slotProps={{ htmlInput: { inputMode: 'decimal' } }}
    />
  );
};
