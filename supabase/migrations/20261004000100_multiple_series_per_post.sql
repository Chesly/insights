-- Allow one post to belong to multiple numbered series.
-- Keep the existing posts.series_id / series_order columns as a compatibility
-- fallback while moving current assignments into the junction table.

create table if not exists public.series (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.post_series (
  post_id uuid not null references public.posts(id) on delete cascade,
  series_id uuid not null references public.series(id) on delete cascade,
  series_order integer,
  primary key (post_id, series_id),
  constraint post_series_order_positive check (series_order is null or series_order > 0)
);

create index if not exists post_series_series_order_idx
  on public.post_series (series_id, series_order, post_id);

alter table public.post_series enable row level security;
drop policy if exists "Anyone can view post series" on public.post_series;
create policy "Anyone can view post series"
  on public.post_series for select using (true);
drop policy if exists "Editors can manage post series" on public.post_series;
create policy "Editors can manage post series"
  on public.post_series for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('super_admin', 'admin', 'editor')
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('super_admin', 'admin', 'editor')
    )
  );

-- Preserve existing series membership and part numbers.
insert into public.post_series (post_id, series_id, series_order)
select id, series_id, series_order
from public.posts
where series_id is not null
on conflict (post_id, series_id) do update
set series_order = excluded.series_order;

-- Expose all series assignments in the existing public posts view.
create or replace view public.posts_with_categories
with (security_invoker = true) as
select
  p.*,
  pc_primary.name as primary_category_name,
  pc_primary.slug as primary_category_slug,
  coalesce(
    (select jsonb_agg(jsonb_build_object('id', c.id, 'name', c.name, 'slug', c.slug, 'color', c.color))
     from public.post_categories pc
     join public.categories c on c.id = pc.category_id
     where pc.post_id = p.id),
    '[]'::jsonb
  ) as categories_json,
  coalesce(
    (select jsonb_agg(jsonb_build_object('id', t.id, 'name', t.name, 'slug', t.slug))
     from public.post_tags pt
     join public.tags t on t.id = pt.tag_id
     where pt.post_id = p.id),
    '[]'::jsonb
  ) as tags_json,
  coalesce(
    (select jsonb_agg(
       jsonb_build_object('id', s.id, 'name', s.name, 'slug', s.slug, 'order', ps.series_order)
       order by ps.series_order nulls last, s.name
     )
     from public.post_series ps
     join public.series s on s.id = ps.series_id
     where ps.post_id = p.id),
    '[]'::jsonb
  ) as series_json
from public.posts p
left join public.categories pc_primary on pc_primary.id = p.category_id;
