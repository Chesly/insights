"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/siteConfig";

export default function Greeting() {
  // Render nothing until mounted to avoid a server/client time mismatch
  // (the server doesn't know the visitor's local time zone).
  const [greeting, setGreeting] = useState<string | null>(null);

  useEffect(() => {
    const hour = new Date().getHours();
    const { morning, afternoon, evening } = siteConfig.utilityBar.greetings;
    if (hour < 12) setGreeting(morning);
    else if (hour < 18) setGreeting(afternoon);
    else setGreeting(evening);
  }, []);

  if (!greeting) return <span className="opacity-0">&nbsp;</span>;
  return <span>{greeting}</span>;
}
