import type { Post } from "@/lib/types";

// NOTE: The "series" feature this component was built for (grouping posts
// into a numbered series with prev/next links) was never finished — the
// Post type has no seriesId/seriesName/seriesOrder fields, and lib/posts.ts
// has no getSeriesPosts function. Rather than guess at that data model,
// this safely renders nothing until the feature is properly built out
// (see src/app/api/series/route.ts for the existing, separate `series`
// table API that a real implementation would likely build on).
export default function SeriesBanner(_props: { post: Post }) {
  return null;
}
