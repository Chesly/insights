"use client";

import { useEffect } from "react";

/**
 * Injects raw custom HTML (from Settings → Custom Head/Footer Code) into
 * the live DOM. Used as an escape hatch for anything not natively
 * supported — verification tags, marketing scripts, future integrations.
 *
 * Note: <script> tags set via innerHTML don't execute in browsers (a
 * security restriction), so we detect and re-create them properly via
 * createElement, which does execute. Runs once, client-side, after mount.
 */
export default function InjectHTML({
  html,
  target = "head",
}: {
  html: string;
  target?: "head" | "body-end";
}) {
  useEffect(() => {
    if (!html || !html.trim()) return;

    const container = document.createElement("div");
    container.innerHTML = html;
    const parent = target === "head" ? document.head : document.body;
    const nodes = Array.from(container.childNodes);

    nodes.forEach((node) => {
      if (node.nodeName === "SCRIPT") {
        const oldScript = node as HTMLScriptElement;
        const newScript = document.createElement("script");
        Array.from(oldScript.attributes).forEach((attr) =>
          newScript.setAttribute(attr.name, attr.value)
        );
        newScript.text = oldScript.text;
        parent.appendChild(newScript);
      } else {
        parent.appendChild(node.cloneNode(true));
      }
    });
  }, [html, target]);

  return null;
}
