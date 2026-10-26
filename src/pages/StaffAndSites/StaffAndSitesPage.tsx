import { useEmployees } from '../../features/employees/useEmployees';
import { EmptyList } from '../../components/EmptyList';
import { AddEmployeeForm } from '../../features/employees/AddEmployeeForm';
import { AddSiteForm } from '../../features/sites/AddSiteForm';
import { SitesList } from '../../features/sites/SitesList';
import { useSites } from '../../features/sites/useSites';
import { EmployeesList } from '../../features/employees/EmployeesList';

export const StaffAndSitesPage = () => {
  const { data: employees, isPending, isError } = useEmployees();
  const {
    data: sites,
    isPending: isPendingSites,
    isError: isErrorSites,
  } = useSites();

  if (isPending) {
    return <div>Ładowanie...</div>;
  }

  if (isError) {
    return <div>Nie udało się załadować listy pracowników.</div>;
  }

  if (isPendingSites) {
    return <div>Ładowanie...</div>;
  }

  if (isErrorSites) {
    return <div>Nie udało się załadować listy budów.</div>;
  }

  const activeEmployees = employees.filter((employee) => employee.is_active);
  const archivedEmployees = employees.filter((employee) => !employee.is_active);

  return (
    <div>
      <AddSiteForm />
      {sites.length > 0 ? (
        <SitesList sites={sites} />
      ) : (
        <EmptyList message="Brak budów do wyświetlenia" />
      )}
      <AddEmployeeForm />
      <h2>Lista pracowników:</h2>
      <h3>Aktywni:</h3>
      {activeEmployees.length > 0 ? (
        <EmployeesList employees={activeEmployees} isActive={true} />
      ) : (
        <EmptyList message="Brak aktywnych pracowników." />
      )}
      <h3>Nieaktywni:</h3>
      {archivedEmployees.length > 0 ? (
        <EmployeesList employees={archivedEmployees} isActive={false} />
      ) : (
        <EmptyList message="Brak zarchiwizowanych pracowników." />
      )}
    </div>
  );
};
