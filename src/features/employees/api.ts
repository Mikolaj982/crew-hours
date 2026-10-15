import { supabase } from '../../lib/supabase';
import type { TablesInsert } from '../../types/database.types';

export const fetchEmployees = async () => {
  const { data, error } = await supabase
    .from('employees')
    .select('id, is_active, name')
    .order('name');

  if (error) throw error;

  return data;
};

export const createEmployee = async (employee: TablesInsert<'employees'>) => {
  const { error } = await supabase.from('employees').insert(employee);

  if (error) throw error;
};

export type SetEmployeeActiveParams = {
  employeeId: string;
  isActive: boolean;
};

export const setEmployeeActive = async ({
  employeeId,
  isActive,
}: SetEmployeeActiveParams) => {
  const { error } = await supabase
    .from('employees')
    .update({ is_active: isActive })
    .eq('id', employeeId);

  if (error) throw error;
};
