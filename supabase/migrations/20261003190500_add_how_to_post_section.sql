alter table public.posts
  drop constraint if exists posts_section_check;

alter table public.posts
  add constraint posts_section_check
  check (section in ('insights', 'coffee', 'how-to'));
