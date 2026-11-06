import { useState } from 'react';
import { Alert, Card, CardContent, CardHeader } from '@mui/material';
import type { Tables } from '../../types/database.types';
import { AddEmployeeForm } from './AddEmployeeForm';
import { useSetEmployeeActive } from './useSetEmployeeActive';
import { ArchivableList } from '../../components/ArchivableList';
import { ArchiveSection } from '../../components/ArchiveSection';
import { UndoSnackbar } from '../../components/UndoSnackbar';
import type { UndoMessage } from '../../components/UndoSnackbar';

type EmployeesPanelProps = {
  employees: Tables<'employees'>[];
};

export const EmployeesPanel = ({ employees }: EmployeesPanelProps) => {
  const { mutate, isPending, isError, variables } = useSetEmployeeActive();
  const [undo, setUndo] = useState<UndoMessage | null>(null);

  const activeEmployees = employees.filter((employee) => employee.is_active);
  const archivedEmployees = employees.filter((employee) => !employee.is_active);
  const pendingId = isPending ? variables.employeeId : undefined;

  const setActive = (employee: Tables<'employees'>, isActive: boolean) => {
    mutate(
      { employeeId: employee.id, isActive },
      {
        onSuccess: () =>
          setUndo({
            text: `${isActive ? 'Przywrócono' : 'Zarchiwizowano'}: ${employee.name}`,
            onUndo: () =>
              mutate({ employeeId: employee.id, isActive: !isActive }),
          }),
        onError: (error) =>
          console.error('Error moving employee status', error),
      },
    );
  };

  return (
    <Card variant="outlined" sx={{ flex: 1 }}>
      <CardHeader
        title="Pracownicy"
        subheader={`Aktywni: ${activeEmployees.length}`}
      />
      <CardContent sx={{ pt: 0 }}>
        <AddEmployeeForm />
        {isError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Nie udało się zmienić statusu pracownika.
          </Alert>
        )}
        <ArchivableList
          items={activeEmployees}
          archived={false}
          pendingId={pendingId}
          emptyText="Nie ma jeszcze pracowników. Dodaj pierwszego powyżej."
          onToggle={(employee) => setActive(employee, false)}
        />
        <ArchiveSection count={archivedEmployees.length}>
          <ArchivableList
            items={archivedEmployees}
            archived
            pendingId={pendingId}
            emptyText=""
            onToggle={(employee) => setActive(employee, true)}
          />
        </ArchiveSection>
      </CardContent>
      <UndoSnackbar message={undo} onClose={() => setUndo(null)} />
    </Card>
  );
};
