create function public.get_month_summary(p_from date, p_to date)
returns table (
  employee_id uuid,
  employee_name text,
  site_id uuid,
  site_name text,
  total_hours numeric
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    e.id,
    e.name,
    s.id,
    s.name,
    sum(t.hours)
  from public.time_entries t
  join public.employees e on e.id = t.employee_id
  join public.sites s on s.id = t.site_id
  where t.date >= p_from
    and t.date < p_to
  group by e.id, e.name, s.id, s.name
  order by s.name, e.name;
$$;

revoke execute on function public.get_month_summary(date, date) from public, anon;

grant execute on function public.get_month_summary(date, date) to authenticated;
