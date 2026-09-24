-- =====================================================================
-- ESQUEMA DE BASE DE DATOS PARA CREATOZZZ
-- =====================================================================
-- Cómo usar este archivo:
-- 1. Entra a tu proyecto en https://supabase.com
-- 2. Ve al menú "SQL Editor" (icono de terminal en la barra lateral)
-- 3. Crea una "New query"
-- 4. Pega TODO este archivo y presiona "Run"
-- Puedes ejecutarlo varias veces sin problema (usa IF NOT EXISTS).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1) TABLA DE CONTENEDORES (los cards de descarga: programas, renders, etc)
-- ---------------------------------------------------------------------
create table if not exists public.containers (
  id uuid primary key default gen_random_uuid(),
  category text not null check (
    category in ('programas', 'plugins', 'renders', 'fondos', 'sonidos', 'materiales')
  ),
  title text not null,
  description text not null default '',
  image_url text not null,
  download_url text,
  web_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by text -- email del admin que lo creó
);

create index if not exists containers_category_idx on public.containers (category);

-- Mantiene "updated_at" siempre actualizado automáticamente
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_containers_updated_at on public.containers;
create trigger trg_containers_updated_at
  before update on public.containers
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- 2) TABLA DE LOGS (registro de todo lo que hace cada admin)
-- ---------------------------------------------------------------------
create table if not exists public.admin_logs (
  id uuid primary key default gen_random_uuid(),
  admin_email text not null,
  action text not null,          -- 'crear' | 'editar' | 'eliminar' | 'login'
  category text,                 -- categoría afectada (si aplica)
  container_title text,          -- título del contenedor afectado (si aplica)
  details jsonb,                 -- info extra libre (antes/después, etc)
  created_at timestamptz not null default now()
);

create index if not exists admin_logs_created_at_idx on public.admin_logs (created_at desc);

-- ---------------------------------------------------------------------
-- 3) SEGURIDAD (Row Level Security)
-- ---------------------------------------------------------------------
-- Reglas:
--   - Cualquier visitante (aunque no esté logeado) puede LEER los containers,
--     porque es lo que se muestra en la web pública.
--   - Solo un usuario AUTENTICADO (o sea, alguien con cuenta creada por vos
--     en Supabase) puede crear, editar o borrar containers, y puede
--     escribir en los logs.
--   - Solo un usuario autenticado puede LEER los logs (son privados).
--
-- Como solo vos vas a crear cuentas de administrador manualmente desde el
-- panel de Supabase (Authentication > Users), "estar autenticado" equivale
-- a "ser admin". No hace falta una tabla extra de admins para esto.

alter table public.containers enable row level security;
alter table public.admin_logs enable row level security;

-- Lectura pública de containers
drop policy if exists "containers_select_public" on public.containers;
create policy "containers_select_public"
  on public.containers for select
  using (true);

-- Escritura solo para usuarios logeados
drop policy if exists "containers_insert_admin" on public.containers;
create policy "containers_insert_admin"
  on public.containers for insert
  to authenticated
  with check (true);

drop policy if exists "containers_update_admin" on public.containers;
create policy "containers_update_admin"
  on public.containers for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "containers_delete_admin" on public.containers;
create policy "containers_delete_admin"
  on public.containers for delete
  to authenticated
  using (true);

-- Logs: solo admins autenticados pueden leer y escribir
drop policy if exists "admin_logs_select_admin" on public.admin_logs;
create policy "admin_logs_select_admin"
  on public.admin_logs for select
  to authenticated
  using (true);

drop policy if exists "admin_logs_insert_admin" on public.admin_logs;
create policy "admin_logs_insert_admin"
  on public.admin_logs for insert
  to authenticated
  with check (true);

-- =====================================================================
-- Fin del script.
-- Después de correr esto, andá a SETUP.md para los siguientes pasos
-- (crear tu usuario admin y migrar los datos actuales).
-- =====================================================================
