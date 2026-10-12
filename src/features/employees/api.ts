import { supabase } from '../../lib/supabase';

export const fetchEmployees = async () => {
  const { data, error } = await supabase
    .from('employees')
    .select('id, is_active, name')
    .order('name');

  if (error) throw error;

  return data;
};
