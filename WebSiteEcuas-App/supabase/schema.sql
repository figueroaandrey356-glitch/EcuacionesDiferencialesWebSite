-- Esquema de Estudiando ED para Supabase.
-- Ejecutar una sola vez en el SQL Editor del proyecto (Dashboard → SQL Editor → New query).

-- ---------------------------------------------------------------------------
-- Administradores: solo las cuentas listadas aquí pueden crear o editar exámenes
-- ---------------------------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

alter table public.admins enable row level security;

create policy "Cada usuario ve su propia fila de admin"
  on public.admins for select
  to authenticated
  using (user_id = (select auth.uid()));

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = (select auth.uid())
  );
$$;

-- ---------------------------------------------------------------------------
-- Exámenes
-- ---------------------------------------------------------------------------
create table if not exists public.exams (
  id uuid primary key default gen_random_uuid(),
  year integer not null,
  semester text not null check (semester in ('I', 'II', 'Verano')),
  name text not null,
  variant text not null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  -- Ruta del PDF dentro del bucket exam-pdfs (null si aún no se ha subido)
  pdf_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists exams_period_idx on public.exams (year, semester);

-- Un solo examen por combinación de año, semestre, nombre y tipo
create unique index if not exists exams_assignment_key
  on public.exams (year, semester, name, variant);

-- Proyectos creados antes de que el sitio fuera solo un banco de exámenes tenían una columna
-- con la solución paso a paso. El sitio ya no la usa; se puede borrar con:
--   alter table public.exams drop column if exists questions;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists exams_touch_updated_at on public.exams;
create trigger exams_touch_updated_at
  before update on public.exams
  for each row execute function public.touch_updated_at();

alter table public.exams enable row level security;

-- El estudiantado (sin sesión) solo lee lo publicado; los borradores solo los ve un admin
create policy "Lectura de exámenes publicados"
  on public.exams for select
  using (status = 'published' or public.is_admin());

create policy "Admins crean exámenes"
  on public.exams for insert
  to authenticated
  with check (public.is_admin());

create policy "Admins editan exámenes"
  on public.exams for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins eliminan exámenes"
  on public.exams for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- PDFs de los exámenes: descarga pública, escritura solo para admins
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('exam-pdfs', 'exam-pdfs', true, 20971520, array['application/pdf'])
on conflict (id) do nothing;

create policy "Admins ven los PDF"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'exam-pdfs' and public.is_admin());

create policy "Admins suben PDF"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'exam-pdfs' and public.is_admin());

create policy "Admins eliminan PDF"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'exam-pdfs' and public.is_admin());

-- ---------------------------------------------------------------------------
-- Después de crear tu usuario en Authentication → Users, dale permisos de admin:
--
--   insert into public.admins (user_id)
--   select id from auth.users where email = 'tu-correo@ejemplo.com';
-- ---------------------------------------------------------------------------
