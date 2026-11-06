import { addMonths, format, parse } from 'date-fns';
import { supabase } from '../../lib/supabase';

export const fetchTimeEntries = async (month: string, siteId: string) => {
  const start = parse(month, 'yyyy-MM', new Date());
  const from = format(start, 'yyyy-MM-dd');
  const to = format(addMonths(start, 1), 'yyyy-MM-dd');

  const { data } = await supabase
    .from('time_entries')
    .select('id, employee_id, site_id, date, hours')
    .eq('site_id', siteId)
    .gte('date', from)
    .lt('date', to)
    .throwOnError();

  return data;
};
