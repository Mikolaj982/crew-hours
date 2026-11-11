import type { Ref } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import type { Tables } from '../../types/database.types';
import type { HoursMatrix } from '../hours/matrix';
import type { MonthDay } from '../hours/calendar';
import { formatHours } from '../hours/calendar';
import { ClampedText } from '../../components/ClampedText';

type ReportGridProps = {
  ref?: Ref<HTMLDivElement>;
  companyName: string | undefined;
  siteName: string;
  period: string;
  days: MonthDay[];
  people: Tables<'employees'>[];
  matrix: HoursMatrix;
};

const cell: SxProps<Theme> = {
  px: 0.5,
  py: 0.75,
  border: 1,
  borderColor: 'divider',
  textAlign: 'center',
};

const nameCell: SxProps<Theme> = {
  ...cell,
  width: 200,
  textAlign: 'left',
  px: 1,
};

const sumCell: SxProps<Theme> = {
  ...cell,
  width: 64,
  fontWeight: 'bold',
};

const dayCell = (day: MonthDay): SxProps<Theme> => ({
  ...cell,
  width: 36,
  bgcolor: day.isWeekend ? 'grey.200' : undefined,
});

export const ReportGrid = ({
  ref,
  companyName,
  siteName,
  period,
  days,
  people,
  matrix,
}: ReportGridProps) => {
  const sumPerson = (employeeId: string) =>
    Object.values(matrix[employeeId] ?? {}).reduce((sum, h) => sum + h, 0);
  const sumDay = (date: string) =>
    people.reduce((sum, e) => sum + (matrix[e.id]?.[date] ?? 0), 0);
  const total = people.reduce((sum, e) => sum + sumPerson(e.id), 0);

  return (
    <Box
      ref={ref}
      sx={{ width: 'max-content', p: 3, bgcolor: '#ffffff', color: '#000000' }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          mb: 2,
        }}
      >
        <Box>
          {companyName && (
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ display: 'block', lineHeight: 1.5 }}
            >
              {companyName}
            </Typography>
          )}
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
            {siteName}
          </Typography>
          <Typography color="text.secondary">
            Godziny pracy · {period}
          </Typography>
        </Box>
        <Box
          sx={{
            px: 2,
            py: 1,
            borderRadius: 1,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            textAlign: 'right',
          }}
        >
          <Typography variant="body2">Razem</Typography>
          <Typography variant="h5" component="p" sx={{ fontWeight: 'bold' }}>
            {formatHours(total)} h
          </Typography>
        </Box>
      </Box>

      <Table size="small" sx={{ width: 'auto', borderCollapse: 'collapse' }}>
        <TableHead>
          <TableRow>
            <TableCell sx={nameCell}>Pracownik</TableCell>
            {days.map((day) => (
              <TableCell key={day.date} sx={dayCell(day)}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {day.dayOfMonth}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {day.weekday}
                </Typography>
              </TableCell>
            ))}
            <TableCell sx={sumCell}>Suma</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {people.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell sx={nameCell}>
                <ClampedText text={employee.name} />
              </TableCell>
              {days.map((day) => {
                const hours = matrix[employee.id]?.[day.date];
                return (
                  <TableCell key={day.date} sx={dayCell(day)}>
                    {hours !== undefined && formatHours(hours)}
                  </TableCell>
                );
              })}
              <TableCell sx={sumCell}>
                {formatHours(sumPerson(employee.id))}
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell sx={{ ...nameCell, fontWeight: 'bold' }}>
              Suma dnia
            </TableCell>
            {days.map((day) => {
              const hours = sumDay(day.date);
              return (
                <TableCell
                  key={day.date}
                  sx={{ ...dayCell(day), fontWeight: 'medium' }}
                >
                  {hours > 0 && formatHours(hours)}
                </TableCell>
              );
            })}
            <TableCell sx={sumCell}>{formatHours(total)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
};
