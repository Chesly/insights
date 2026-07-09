import { NextRequest, NextResponse } from "next/server";
import { searchPosts } from "@/lib/search";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") || "";
  const results = searchPosts(q, 8);
  return NextResponse.json({ query: q, results });
}
