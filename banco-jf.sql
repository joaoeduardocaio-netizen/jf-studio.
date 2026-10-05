-- Banco próprio JF Studio. Executado uma vez no projeto JF.
create table public.jf_admins (
 user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.jf_admins enable row level security;
grant select on public.jf_admins to authenticated;
grant select on public.jf_admins to anon; -- RLS não permite ler administradores sem login.
create policy jf_admin_self on public.jf_admins for select to authenticated using(user_id=(select auth.uid()));
create table public.jf_categories (
 name text primary key check(char_length(name) between 1 and 80),
 created_at timestamptz not null default now()
);
alter table public.jf_categories enable row level security;
grant select on public.jf_categories to anon,authenticated;
grant insert,update,delete on public.jf_categories to authenticated;
create policy jf_categories_read on public.jf_categories for select to anon,authenticated using(true);
create policy jf_categories_write on public.jf_categories for all to authenticated using(exists(select 1 from public.jf_admins where user_id=(select auth.uid()))) with check(exists(select 1 from public.jf_admins where user_id=(select auth.uid())));
insert into public.jf_categories(name) values ('Articulados'),('Personagens'),('Letreiros'),('Decoração'),('Chaveiros'),('Personalizados');
create table public.jf_products (
 id uuid primary key default gen_random_uuid(),
 name text not null check(char_length(name) between 1 and 150),
 category text not null references public.jf_categories(name) on update cascade,
 description text not null default '' check(char_length(description)<=5000),
 price numeric(12,2) check(price is null or price>=0),
 featured boolean not null default false,
 published boolean not null default true,
 media jsonb not null default '[]' check(jsonb_typeof(media)='array' and jsonb_array_length(media)<=12),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
alter table public.jf_products enable row level security;
grant select on public.jf_products to anon,authenticated;
grant insert,update,delete on public.jf_products to authenticated;
create policy jf_products_read on public.jf_products for select to anon,authenticated using(published or exists(select 1 from public.jf_admins where user_id=(select auth.uid())));
create policy jf_products_write on public.jf_products for all to authenticated using(exists(select 1 from public.jf_admins where user_id=(select auth.uid()))) with check(exists(select 1 from public.jf_admins where user_id=(select auth.uid())));
create index jf_products_category on public.jf_products(category);
create index jf_products_public_order on public.jf_products(published,featured,created_at desc);
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('jf-media','jf-media',true,52428800,array['image/jpeg','image/png','image/webp','video/mp4','video/webm']);
create policy jf_media_admin on storage.objects for all to authenticated using(bucket_id='jf-media' and exists(select 1 from public.jf_admins where user_id=(select auth.uid()))) with check(bucket_id='jf-media' and exists(select 1 from public.jf_admins where user_id=(select auth.uid())));
