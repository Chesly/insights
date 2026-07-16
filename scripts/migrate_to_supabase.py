#!/usr/bin/env python3
"""
Generates supabase-content-seed.sql from content/posts/*.mdx.
Run once: python3 scripts/migrate_to_supabase.py
Then paste the output SQL file into Supabase's SQL Editor and run it.
"""
import os, re, json, html
import markdown as md_lib

POSTS_DIR = "content/posts"
OUT_FILE = "supabase-content-seed.sql"
DEFAULT_AUTHOR_NAME = "Chesly Silaule"
DEFAULT_AUTHOR_SLUG = "chesly-silaule"

def slugify(s):
    s = s.lower().strip()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")

def sql_str(v):
    if v is None:
        return "NULL"
    return "'" + str(v).replace("'", "''") + "'"

def sql_jsonb(v):
    return "'" + json.dumps(v, ensure_ascii=False).replace("'", "''") + "'::jsonb"

def parse_frontmatter(text):
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.DOTALL)
    if not m:
        return {}, text
    fm_text, body = m.group(1), m.group(2)
    data = {}
    # Minimal YAML: key: value | key: ["a","b"] | key: true/false
    for line in fm_text.split("\n"):
        line = line.rstrip()
        if not line.strip() or line.strip().startswith("#"):
            continue
        if ":" not in line:
            continue
        key, _, val = line.partition(":")
        key = key.strip()
        val = val.strip()
        if val.startswith("[") and val.endswith("]"):
            items = re.findall(r'"([^"]*)"', val)
            data[key] = items
        elif val.lower() in ("true", "false"):
            data[key] = val.lower() == "true"
        elif val.startswith('"') and val.endswith('"'):
            data[key] = val[1:-1]
        else:
            data[key] = val
    return data, body

categories_seen = {}   # slug -> name
tags_seen = {}         # slug -> name
posts_out = []
post_categories_out = []
post_tags_out = []

files = sorted(f for f in os.listdir(POSTS_DIR) if f.endswith(".mdx"))
for fname in files:
    slug = fname[:-4]
    with open(os.path.join(POSTS_DIR, fname), encoding="utf-8") as fh:
        raw = fh.read()
    fm, body_md = parse_frontmatter(raw)

    cats = fm.get("categories") or ([fm["category"]] if isinstance(fm.get("category"), str) else fm.get("category") or [])
    if isinstance(cats, str):
        cats = [cats]
    if not cats:
        cats = ["Uncategorised"]
    tags = fm.get("tags") or []
    keywords = fm.get("keywords") or []

    for c in cats:
        categories_seen.setdefault(slugify(c), c)
    for t in tags:
        tags_seen.setdefault(slugify(t), t)

    body_html = md_lib.markdown(body_md.strip(), extensions=["fenced_code", "tables"])

    author_name = fm.get("author") or DEFAULT_AUTHOR_NAME
    author_slug = fm.get("authorSlug") or DEFAULT_AUTHOR_SLUG
    status = "draft" if fm.get("draft") else "published"
    published_at = fm.get("publishedDate")

    posts_out.append({
        "slug": slug,
        "title": fm.get("title", slug),
        "excerpt": fm.get("description", ""),
        "body": body_html,
        "featured_image": fm.get("image", ""),
        "author_name": author_name,
        "author_slug": author_slug,
        "primary_category_slug": slugify(cats[0]),
        "all_category_slugs": [slugify(c) for c in cats],
        "tag_slugs": [slugify(t) for t in tags],
        "status": status,
        "featured": bool(fm.get("featured")),
        "trending": bool(fm.get("trending")),
        "popular": bool(fm.get("popular")),
        "seo_title": fm.get("seoTitle", ""),
        "meta_description": fm.get("seoDescription", ""),
        "published_at": published_at,
        "keywords": keywords,
    })

lines = []
lines.append("-- ============================================================")
lines.append("-- CONTENT SEED — generated from content/posts/*.mdx")
lines.append(f"-- {len(posts_out)} posts, {len(categories_seen)} categories, {len(tags_seen)} tags")
lines.append("-- Run in Supabase SQL Editor AFTER supabase-schema.sql and supabase-migration-2.sql")
lines.append("-- ============================================================\n")

# Categories (skip ones already seeded by supabase-schema.sql; ON CONFLICT handles dupes safely)
lines.append("-- Categories (safe if already present)")
for slug, name in categories_seen.items():
    lines.append(
        f"INSERT INTO public.categories (name, slug) VALUES ({sql_str(name)}, {sql_str(slug)}) "
        f"ON CONFLICT (slug) DO NOTHING;"
    )
lines.append("")

# Tags
lines.append("-- Tags")
for slug, name in tags_seen.items():
    lines.append(
        f"INSERT INTO public.tags (name, slug) VALUES ({sql_str(name)}, {sql_str(slug)}) "
        f"ON CONFLICT (slug) DO NOTHING;"
    )
lines.append("")

# Posts + junctions, using a DO block per post so we can look up category_id/tag_id by slug
lines.append("-- Posts")
for p in posts_out:
    cat_slugs_sql = ", ".join(sql_str(s) for s in p["all_category_slugs"])
    tag_slugs_sql = ", ".join(sql_str(s) for s in p["tag_slugs"]) or "NULL"
    lines.append(f"""DO $$
DECLARE new_post_id UUID;
DECLARE primary_cat_id UUID;
BEGIN
  SELECT id INTO primary_cat_id FROM public.categories WHERE slug = {sql_str(p['primary_category_slug'])} LIMIT 1;

  INSERT INTO public.posts (
    title, slug, excerpt, body, featured_image, author_name, author_slug,
    category_id, status, featured, trending, popular,
    seo_title, meta_description, published_at, read_time, keywords
  ) VALUES (
    {sql_str(p['title'])}, {sql_str(p['slug'])}, {sql_str(p['excerpt'])}, {sql_str(p['body'])},
    {sql_str(p['featured_image'])}, {sql_str(p['author_name'])}, {sql_str(p['author_slug'])},
    primary_cat_id, {sql_str(p['status'])}, {str(p['featured']).lower()}, {str(p['trending']).lower()}, {str(p['popular']).lower()},
    {sql_str(p['seo_title'])}, {sql_str(p['meta_description'])},
    {sql_str(p['published_at'])}::timestamptz, {max(1, len(p['body']) // 1000)}, {sql_jsonb(p['keywords'])}
  )
  ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO new_post_id;

  IF new_post_id IS NOT NULL THEN
    INSERT INTO public.post_categories (post_id, category_id)
    SELECT new_post_id, c.id FROM public.categories c WHERE c.slug IN ({cat_slugs_sql})
    ON CONFLICT DO NOTHING;

    INSERT INTO public.post_tags (post_id, tag_id)
    SELECT new_post_id, t.id FROM public.tags t WHERE t.slug IN ({tag_slugs_sql})
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
""")

with open(OUT_FILE, "w", encoding="utf-8") as fh:
    fh.write("\n".join(lines))

print(f"Wrote {OUT_FILE}: {len(posts_out)} posts, {len(categories_seen)} categories, {len(tags_seen)} tags")
