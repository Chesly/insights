import React from "react";

/**
 * Turns a raw HTML snippet (from Settings → Custom Head/Footer Code — an
 * admin-pasted escape hatch for verification tags, analytics scripts,
 * etc.) into real React elements rendered server-side. This matters
 * because crawlers (Bing/Google site-verification, social scrapers) read
 * the HTML a server returns and never run JavaScript — a tag injected
 * client-side via useEffect is invisible to them even though a human
 * visiting in a browser would see it fine.
 */
function parseAttrs(attrString: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const attrRegex = /([a-zA-Z][a-zA-Z0-9-:]*)\s*=\s*"([^"]*)"|([a-zA-Z][a-zA-Z0-9-:]*)\s*=\s*'([^']*)'/g;
  let m: RegExpExecArray | null;
  while ((m = attrRegex.exec(attrString)) !== null) {
    const name = m[1] || m[3];
    const value = m[2] ?? m[4] ?? "";
    attrs[name === "class" ? "className" : name] = value;
  }
  return attrs;
}

export function parseRawHtmlTags(html: string): React.ReactNode[] {
  const tagRegex =
    /<(meta|link|base)\b([^>]*)\/?>|<(script|style|noscript)\b([^>]*)>([\s\S]*?)<\/\3>/gi;
  const elements: React.ReactNode[] = [];
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = tagRegex.exec(html)) !== null) {
    i++;
    if (match[1]) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      elements.push(React.createElement(match[1].toLowerCase(), { key: i, ...parseAttrs(match[2]) } as any));
    } else if (match[3]) {
      const attrs = parseAttrs(match[4]);
      const content = match[5] || "";
      elements.push(
        React.createElement(match[3].toLowerCase(), {
          key: i,
          ...attrs,
          dangerouslySetInnerHTML: { __html: content },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)
      );
    }
  }
  return elements;
}
