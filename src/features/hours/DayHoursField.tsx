import { InputAdornment, TextField } from '@mui/material';
import { useHoursInput } from './useHoursInput';

type DayHoursFieldProps = {
  label: string;
  employeeId: string;
  siteId: string;
  date: string;
  savedHours: number | undefined;
};

export const DayHoursField = (props: DayHoursFieldProps) => {
  const { text, change, error, isPending, save, blurOnEnter, inputRef } =
    useHoursInput(props);

  return (
    <TextField
      label={props.label}
      inputRef={inputRef}
      value={text}
      onChange={(event) => change(event.target.value)}
      onBlur={save}
      onKeyDown={blurOnEnter}
      error={error !== null}
      helperText={error ?? (isPending ? 'Zapisywanie...' : ' ')}
      fullWidth
      slotProps={{
        htmlInput: { inputMode: 'decimal' },
        input: {
          endAdornment: <InputAdornment position="end">h</InputAdornment>,
        },
      }}
    />
  );
};
