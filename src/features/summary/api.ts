import { supabase } from '../../lib/supabase';
import { getMonthRange } from '../hours/calendar';

export const fetchMonthSummary = async (month: string) => {
  const { from, to } = getMonthRange(month);

  const { data } = await supabase
    .rpc('get_month_summary', { p_from: from, p_to: to })
    .throwOnError();

  return data;
};
