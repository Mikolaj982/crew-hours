import { useEmployees } from '../../features/employees/useEmployees';
import { EmptyList } from '../../components/EmptyList';

export const StaffPage = () => {
  const { data: employees, isPending, isError } = useEmployees();

  if (isPending) {
    return <div>Ładowanie...</div>;
  }

  if (isError) {
    return <div>Nie udało się załadować listy pracowników.</div>;
  }

  const activeEmployees = employees.filter((employee) => employee.is_active);
  const archivedEmployees = employees.filter((employee) => !employee.is_active);

  return (
    <div>
      <h2>Lista pracowników:</h2>
      <h3>Aktywni:</h3>
      <ul>
        {activeEmployees.length > 0 ? (
          activeEmployees.map((employee) => (
            <li key={employee.id}>{employee.name}</li>
          ))
        ) : (
          <EmptyList message="Brak aktywnych pracowników." />
        )}
      </ul>
      <h3>Nieaktywni:</h3>
      <ul>
        {archivedEmployees.length > 0 ? (
          archivedEmployees.map((employee) => (
            <li key={employee.id}>{employee.name}</li>
          ))
        ) : (
          <EmptyList message="Brak nieaktywnych pracowników." />
        )}
      </ul>
    </div>
  );
};
