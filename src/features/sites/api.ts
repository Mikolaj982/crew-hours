import { supabase } from '../../lib/supabase';
import type { TablesInsert, Tables } from '../../types/database.types';

export const fetchSites = async (): Promise<Tables<'sites'>[]> => {
  const { data } = await supabase
    .from('sites')
    .select('id, is_active, name')
    .order('name')
    .throwOnError();

  return data;
};

export const createSite = async (site: TablesInsert<'sites'>) => {
  await supabase.from('sites').insert(site).throwOnError();
};

export type SetSiteActiveParams = {
  siteId: string;
  isActive: boolean;
};

export const setSiteActive = async ({
  siteId,
  isActive,
}: SetSiteActiveParams) => {
  await supabase
    .from('sites')
    .update({ is_active: isActive })
    .eq('id', siteId)
    .throwOnError();
};
