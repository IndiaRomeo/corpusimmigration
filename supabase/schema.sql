create table if not exists public.solicitudes_ayuda (
	id uuid primary key default gen_random_uuid(),
	created_at timestamptz not null default now(),
	nombre_completo text not null check (length(trim(nombre_completo)) > 0),
	fecha_nacimiento date not null check (fecha_nacimiento <= current_date),
	pais_origen text not null check (length(trim(pais_origen)) > 0),
	ciudad_estado text not null check (length(trim(ciudad_estado)) > 0),
	telefono text not null check (length(trim(telefono)) > 0),
	correo text,
	whatsapp boolean not null,
	tipo_ayuda text not null check (
		tipo_ayuda in ('Asilo', 'Corte de inmigración', 'Fianza', 'Familia', 'Permiso de trabajo', 'Otro')
	),
	tipo_ayuda_otro text,
	audiencia boolean not null,
	fecha_audiencia date,
	detenido boolean not null,
	abogado_previo boolean not null,
	descripcion text not null check (length(trim(descripcion)) > 0),
	dependientes integer check (dependientes is null or dependientes >= 0),
	urgencia text,
	confirma_verdad boolean not null check (confirma_verdad),
	autoriza_contacto boolean not null check (autoriza_contacto),
	constraint solicitud_otro_especificado check (
		tipo_ayuda <> 'Otro' or length(trim(coalesce(tipo_ayuda_otro, ''))) > 0
	),
	constraint solicitud_fecha_audiencia check (
		not audiencia or fecha_audiencia is not null
	)
);

create table if not exists public.admin_users (
	user_id uuid primary key references auth.users(id) on delete cascade,
	created_at timestamptz not null default now()
);

create index if not exists solicitudes_ayuda_created_at_idx
	on public.solicitudes_ayuda (created_at desc);

alter table public.solicitudes_ayuda enable row level security;
alter table public.admin_users enable row level security;

create or replace function public.is_solicitudes_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
	select exists (
		select 1
		from public.admin_users
		where user_id = (select auth.uid())
	);
$$;

revoke all on function public.is_solicitudes_admin() from public;
grant execute on function public.is_solicitudes_admin() to authenticated;

revoke all on public.solicitudes_ayuda from anon, authenticated;
revoke all on public.admin_users from anon, authenticated;
grant insert (
	nombre_completo, fecha_nacimiento, pais_origen, ciudad_estado,
	telefono, correo, whatsapp, tipo_ayuda, tipo_ayuda_otro,
	audiencia, fecha_audiencia, detenido, abogado_previo, descripcion,
	dependientes, urgencia, confirma_verdad, autoriza_contacto
) on public.solicitudes_ayuda to anon, authenticated;
grant select on public.solicitudes_ayuda to authenticated;
grant usage on schema public to anon, authenticated;

drop policy if exists "Anyone can submit a help request" on public.solicitudes_ayuda;
create policy "Anyone can submit a help request"
	on public.solicitudes_ayuda
	for insert
	to anon, authenticated
	with check (true);

drop policy if exists "Admins can read help requests" on public.solicitudes_ayuda;
create policy "Admins can read help requests"
	on public.solicitudes_ayuda
	for select
	to authenticated
	using ((select public.is_solicitudes_admin()));

drop policy if exists "Users can verify their own admin access" on public.admin_users;
create policy "Users can verify their own admin access"
	on public.admin_users
	for select
	to authenticated
	using (user_id = (select auth.uid()));
