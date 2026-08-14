import { redirect } from "next/navigation";
import PageHero from "@/components/PageHero";
import { createServiceClient } from "@/lib/supabase/service";

const FILE_TYPE_ICONS: Record<string, string> = {
  pdf: "📄", zip: "🗜️", doc: "📝", xlsx: "📊", audio: "🎧", other: "📦",
};

interface BundleFile {
  name: string;
  url: string;
  fileType: string;
}

// Read-only — /api/download/[token] already validated the token and
// counted this as a use before redirecting here, so this page just
// looks up and displays what that token unlocks. Revisiting/refreshing
// this exact page doesn't consume another use.
export default async function BundleDownloadPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = createServiceClient();

  const { data: record } = await supabase
    .from("download_tokens")
    .select("download:downloads(name, bundle_files)")
    .eq("token", token)
    .single();

  const download = record?.download as { name: string; bundle_files: BundleFile[] } | null | undefined;
  const files = download?.bundle_files || [];
  if (!download || files.length === 0) {
    redirect("/download-expired?reason=invalid");
  }

  return (
    <div>
      <PageHero title={download.name} breadcrumbs={[{ label: "Home", href: "/" }]} />
      <div className="container-page py-16">
        <div className="mx-auto max-w-md text-center">
          <p className="text-3xl">📦</p>
          <h1 className="mt-4 text-xl font-bold text-navy dark:text-white">Your download is ready</h1>
          <p className="mt-2 text-sm text-navy/60 dark:text-white/60">
            This product includes {files.length} file{files.length > 1 ? "s" : ""} — download each one below.
          </p>
          <ul className="mt-6 space-y-2 text-left">
            {files.map((f, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-3 border border-gold/15 p-3"
              >
                <span className="flex min-w-0 items-center gap-2 truncate text-sm font-medium text-navy dark:text-white">
                  <span aria-hidden="true">{FILE_TYPE_ICONS[f.fileType] || "📦"}</span>
                  <span className="truncate">{f.name}</span>
                </span>
                <a
                  href={f.url}
                  className="shrink-0 bg-gold px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-gold-dark"
                >
                  Download
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
