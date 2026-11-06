import { TableCell } from '@mui/material';
import { useHoursInput } from './useHoursInput';

type HoursCellProps = {
  employeeId: string;
  siteId: string;
  date: string;
  savedHours: number | undefined;
  isWeekend: boolean;
};

export const HoursCell = ({ isWeekend, ...entry }: HoursCellProps) => {
  const { text, setText, error, isPending, save, blurOnEnter } =
    useHoursInput(entry);

  return (
    <TableCell
      align="center"
      sx={{
        p: 0,
        bgcolor: error ? 'error.light' : isWeekend ? 'action.hover' : undefined,
        '& input': {
          width: '3.5em',
          border: 'none',
          background: 'transparent',
          font: 'inherit',
          textAlign: 'center',
        },
      }}
    >
      <input
        value={text}
        onChange={(event) => setText(event.target.value)}
        onBlur={save}
        onKeyDown={blurOnEnter}
        inputMode="decimal"
        title={error ?? undefined}
        aria-label={`Godziny ${entry.date}`}
        aria-invalid={error !== null}
        style={{ opacity: isPending ? 0.5 : 1 }}
      />
    </TableCell>
  );
};
