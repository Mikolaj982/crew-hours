import { useEmployees } from '../../features/employees/useEmployees';
import { EmptyList } from '../../components/EmptyList';
import { AddEmployeeForm } from '../../features/employees/AddEmployeeForm';
import { useSetEmployeeActive } from '../../features/employees/useSetEmployeeActive';
import type { SetEmployeeActiveParams } from '../../features/employees/api';

export const StaffPage = () => {
  const { data: employees, isPending, isError } = useEmployees();
  const {
    mutate,
    isPending: isPendingForSetActive,
    isError: isSetEmployeeActiveError,
  } = useSetEmployeeActive();

  if (isPending) {
    return <div>Ładowanie...</div>;
  }

  if (isError) {
    return <div>Nie udało się załadować listy pracowników.</div>;
  }

  const handleActive = (data: SetEmployeeActiveParams) => {
    mutate(data, {
      onError: (error) => {
        console.error('Error moving employee status', error);
      },
    });
  };

  const activeEmployees = employees.filter((employee) => employee.is_active);
  const archivedEmployees = employees.filter((employee) => !employee.is_active);

  return (
    <div>
      <AddEmployeeForm />
      <h2>Lista pracowników:</h2>
      <h3>Aktywni:</h3>
      {activeEmployees.length > 0 ? (
        <ul>
          {activeEmployees.map((employee) => (
            <li key={employee.id}>
              {employee.name}
              <button
                onClick={() =>
                  handleActive({ employeeId: employee.id, isActive: false })
                }
                disabled={isPendingForSetActive}
              >
                Archiwizuj
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyList message="Brak aktywnych pracowników." />
      )}
      <h3>Nieaktywni:</h3>
      {archivedEmployees.length > 0 ? (
        <ul>
          {archivedEmployees.map((employee) => (
            <li key={employee.id}>
              {employee.name}
              <button
                onClick={() =>
                  handleActive({ employeeId: employee.id, isActive: true })
                }
                disabled={isPendingForSetActive}
              >
                Przywróć
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyList message="Brak zarchiwizowanych pracowników." />
      )}
      {isSetEmployeeActiveError && (
        <p>Coś poszło nie tak... Spróbuj ponownie</p>
      )}
    </div>
  );
};
