"use client";

export default function DownloadButton({
  id,
  fileUrl,
  label,
}: {
  id: string;
  fileUrl: string;
  label: string;
}) {
  const handleClick = () => {
    // Fire-and-forget — never let a tracking hiccup block the actual download.
    fetch(`/api/public/downloads/${id}/track`, { method: "POST" }).catch(() => {});
  };

  return (
    <a
      href={fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="mt-6 inline-block border border-gold bg-gold px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-white hover:bg-gold-dark transition-colors"
    >
      {label}
    </a>
  );
}
