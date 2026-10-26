import type { Tables } from '../../types/database.types';
import type { SetEmployeeActiveParams } from './api';
import { useSetEmployeeActive } from './useSetEmployeeActive';

type EmployeesListProps = {
  employees: Tables<'employees'>[];
  isActive: boolean;
};

export const EmployeesList = ({ employees, isActive }: EmployeesListProps) => {
  const {
    mutate,
    isPending: isPendingForSetActive,
    isError: isSetEmployeeActiveError,
  } = useSetEmployeeActive();
  const handleActive = (data: SetEmployeeActiveParams) => {
    mutate(data, {
      onError: (error) => {
        console.error('Error moving employee status', error);
      },
    });
  };

  return (
    <>
      <ul>
        {employees.map((employee) => (
          <li key={employee.id}>
            {employee.name}
            <button
              onClick={() =>
                handleActive({ employeeId: employee.id, isActive: !isActive })
              }
              disabled={isPendingForSetActive}
            >
              {isActive ? 'Archiwizuj' : 'Przywróć'}
            </button>
          </li>
        ))}
      </ul>
      {isSetEmployeeActiveError && (
        <p style={{ color: 'red' }}>
          Wystąpił błąd podczas zmiany statusu pracownika
        </p>
      )}
    </>
  );
};
