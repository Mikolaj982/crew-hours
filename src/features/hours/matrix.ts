import type { Tables } from '../../types/database.types';

type EmployeeId = string;
type IsoDate = string;
export type HoursMatrix = Record<EmployeeId, Record<IsoDate, number>>;
type TimeEntry = Pick<Tables<'time_entries'>, 'employee_id' | 'date' | 'hours'>;

export const buildHoursMatrix = (entries: TimeEntry[]): HoursMatrix => {
  const matrix: HoursMatrix = {};

  for (const entry of entries) {
    matrix[entry.employee_id] ??= {};
    matrix[entry.employee_id][entry.date] = entry.hours;
  }

  return matrix;
};

export const getVisibleEmployees = (
  employees: Tables<'employees'>[],
  matrix: HoursMatrix,
) => employees.filter((employee) => employee.is_active || matrix[employee.id]);
