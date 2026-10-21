"use client";

import { useEffect, useState } from "react";

export function relativeTime(iso: string, now = Date.now()) {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) {
    return "Just now";
  }
  const diff = Math.max(0, now - then);
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(iso).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function TimeAgo({ iso, prefix = "Posted" }: { iso: string; prefix?: string }) {
  const [label, setLabel] = useState("Just now");

  useEffect(() => {
    const tick = () => setLabel(relativeTime(iso));
    tick();
    const timer = window.setInterval(tick, 60000);
    return () => window.clearInterval(timer);
  }, [iso]);

  return (
    <span suppressHydrationWarning>
      {prefix} {label.toLowerCase()}
    </span>
  );
}
