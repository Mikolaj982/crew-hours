import { supabase } from '../../lib/supabase';
import type { TablesInsert } from '../../types/database.types';

export const fetchEmployees = async () => {
  const { data } = await supabase
    .from('employees')
    .select('id, is_active, name')
    .order('name')
    .throwOnError();

  return data;
};

export const createEmployee = async (employee: TablesInsert<'employees'>) => {
  await supabase.from('employees').insert(employee).throwOnError();
};

export type SetEmployeeActiveParams = {
  employeeId: string;
  isActive: boolean;
};

export const setEmployeeActive = async ({
  employeeId,
  isActive,
}: SetEmployeeActiveParams) => {
  await supabase
    .from('employees')
    .update({ is_active: isActive })
    .eq('id', employeeId)
    .throwOnError();
};
