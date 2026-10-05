create table public.employees (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  is_active boolean not null default true
);

create table public.sites (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  is_active boolean not null default true
);

create table public.time_entries (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id) on delete restrict,
  site_id uuid not null references public.sites(id) on delete restrict,
  date date not null,
  hours numeric(3, 1) not null 
  check (hours > 0 and hours <= 24 AND hours * 2 = round(hours * 2)), 
  unique (employee_id, site_id, date)
);

alter table public.employees enable row level security;

alter table public.sites enable row level security;

alter table public.time_entries enable row level security;

grant select, insert, update on table public.employees to authenticated;

grant select, insert, update on table public.sites to authenticated;

grant select, insert, update, delete on table public.time_entries to authenticated;

create policy "authenticated full access"
  on public.employees
  for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated full access"
  on public.sites
  for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated full access"
  on public.time_entries
  for all
  to authenticated
  using (true)
  with check (true);