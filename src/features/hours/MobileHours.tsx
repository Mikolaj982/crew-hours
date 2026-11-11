import { Alert, Box, Button, Drawer, Paper, Stack } from '@mui/material';
import { useTimeEntries } from './useTimeEntries';
import { getDayTotals } from './matrix';
import { MonthSwitcher } from './MonthSwitcher';
import { MonthCalendar } from './MonthCalendar';
import { DayView } from './DayView';
import { Loading } from '../../components/Loading';

type MobileHoursProps = {
  siteId: string;
  month: string;
  openDay: string | null;
  onMonthChange: (month: string) => void;
  onOpenDay: (day: string) => void;
  onDayChange: (day: string) => void;
  onClose: () => void;
};

export const MobileHours = ({
  siteId,
  month,
  openDay,
  onMonthChange,
  onOpenDay,
  onDayChange,
  onClose,
}: MobileHoursProps) => {
  const entriesQuery = useTimeEntries(month, siteId);

  const renderCalendar = () => {
    if (entriesQuery.isPending) {
      return <Loading />;
    }

    if (entriesQuery.isError) {
      return <Alert severity="error">Nie udało się załadować godzin.</Alert>;
    }

    return (
      <MonthCalendar
        month={month}
        totals={getDayTotals(entriesQuery.data)}
        onSelectDay={onOpenDay}
      />
    );
  };

  return (
    <Stack spacing={2}>
      <MonthSwitcher month={month} onChange={onMonthChange} />
      <Paper variant="outlined" sx={{ p: 1 }}>
        {renderCalendar()}
      </Paper>

      <Drawer
        anchor="bottom"
        open={openDay !== null}
        onClose={onClose}
        slotProps={{
          paper: {
            sx: {
              maxHeight: '90vh',
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              p: 2,
            },
          },
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 4,
            mx: 'auto',
            mb: 1,
            borderRadius: 2,
            bgcolor: 'divider',
          }}
        />
        {openDay && (
          <DayView siteId={siteId} day={openDay} onDayChange={onDayChange} />
        )}
        <Button variant="contained" onClick={onClose} sx={{ mt: 2 }}>
          Gotowe
        </Button>
      </Drawer>
    </Stack>
  );
};
