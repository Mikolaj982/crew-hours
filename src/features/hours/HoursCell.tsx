import { TableCell } from '@mui/material';
import { useHoursInput } from './useHoursInput';
import { dayCellBg } from './dayCellBg';

type HoursCellProps = {
  label: string;
  employeeId: string;
  siteId: string;
  date: string;
  savedHours: number | undefined;
  isWeekend: boolean;
  isToday: boolean;
};

export const HoursCell = ({ isWeekend, isToday, ...entry }: HoursCellProps) => {
  const { text, change, error, isPending, save, blurOnEnter, inputRef } =
    useHoursInput(entry);

  return (
    <TableCell
      align="center"
      sx={{
        p: 0,
        bgcolor: error ? 'error.light' : dayCellBg({ isWeekend, isToday }),
        '& input': {
          width: '3.5em',
          py: 1,
          border: 'none',
          borderRadius: 1,
          background: 'transparent',
          font: 'inherit',
          textAlign: 'center',
        },
        '& input:hover': { bgcolor: 'action.hover' },
        '& input:focus': {
          outline: (theme) => `2px solid ${theme.palette.primary.main}`,
          bgcolor: 'background.paper',
        },
      }}
    >
      <input
        ref={inputRef}
        value={text}
        onChange={(event) => change(event.target.value)}
        onBlur={save}
        onKeyDown={blurOnEnter}
        inputMode="decimal"
        title={error ?? undefined}
        aria-label={`Godziny: ${entry.label}`}
        aria-invalid={error !== null}
        style={{ opacity: isPending ? 0.5 : 1 }}
      />
    </TableCell>
  );
};
