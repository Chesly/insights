// Matches "[label](https://url)" markdown-style links, or a bare pasted
// URL on its own. Kept intentionally narrow (no general HTML) so FAQ
// answers can link out — e.g. to a product download — without opening up
// arbitrary HTML injection through a plain textarea.
const LINK_PATTERN = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s)]*[^\s).,;:!?])/g;

interface LinkPart {
  href: string;
  label: string;
}

function parseFaqAnswer(text: string): (string | LinkPart)[] {
  const parts: (string | LinkPart)[] = [];
  let lastIndex = 0;
  for (const match of text.matchAll(LINK_PATTERN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) parts.push(text.slice(lastIndex, index));
    parts.push(match[1] && match[2] ? { label: match[1], href: match[2] } : { label: match[3], href: match[3] });
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

/** Renders an FAQ answer with any [label](url) links or bare URLs turned
    into real, clickable links. */
export default function FaqAnswer({ text }: { text: string }) {
  return (
    <>
      {parseFaqAnswer(text).map((part, i) =>
        typeof part === "string" ? (
          part
        ) : (
          <a
            key={i}
            href={part.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold underline decoration-gold/40 underline-offset-2 hover:decoration-gold"
          >
            {part.label}
          </a>
        )
      )}
    </>
  );
}

/** Plain-text version for JSON-LD FAQPage structured data — search/AI
    engines shouldn't be shown raw "[label](url)" markdown syntax. */
export function faqAnswerToPlainText(text: string): string {
  return parseFaqAnswer(text)
    .map((part) => (typeof part === "string" ? part : part.label === part.href ? part.href : `${part.label} (${part.href})`))
    .join("");
}
