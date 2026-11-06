import { useState } from 'react';
import { TextField } from '@mui/material';
import { formatHours } from './calendar';
import { parseHours } from './parseHours';
import { useSaveTimeEntry } from './useSaveTimeEntry';

type DayHoursFieldProps = {
  label: string;
  employeeId: string;
  siteId: string;
  date: string;
  savedHours: number | undefined;
};

export const DayHoursField = ({
  label,
  employeeId,
  siteId,
  date,
  savedHours,
}: DayHoursFieldProps) => {
  const [text, setText] = useState(
    savedHours === undefined ? '' : formatHours(savedHours),
  );
  const [error, setError] = useState<string | null>(null);
  const { mutate, isPending } = useSaveTimeEntry();

  const handleSave = () => {
    const result = parseHours(text);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setError(null);

    if (result.hours === (savedHours ?? null)) {
      return;
    }

    mutate(
      { employeeId, siteId, date, hours: result.hours },
      { onError: () => setError('Nie udało się zapisać. Spróbuj ponownie.') },
    );
  };

  return (
    <TextField
      label={label}
      value={text}
      onChange={(event) => setText(event.target.value)}
      onBlur={handleSave}
      onKeyDown={(event) => {
        if (event.key === 'Enter' && event.target instanceof HTMLElement) {
          event.target.blur();
        }
      }}
      error={error !== null}
      helperText={error ?? (isPending ? 'Zapisywanie...' : ' ')}
      fullWidth
      slotProps={{ htmlInput: { inputMode: 'decimal' } }}
    />
  );
};
