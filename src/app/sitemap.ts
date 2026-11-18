import type { MetadataRoute } from "next";
import { insights } from "@/content/insights";
import { siteUrl } from "@/content/site";

// Fixed date (no Date() at build): update when content changes.
const LAST_UPDATED = "2026-11-19";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/capabilities", "/work", "/people", "/insights", "/company", "/contact", "/privacy", "/terms"];
  return [
    ...pages.map((p) => ({ url: `${siteUrl}${p}`, lastModified: LAST_UPDATED, priority: p === "" ? 1 : 0.7 })),
    ...insights.map((i) => ({ url: `${siteUrl}/insights/${i.slug}`, lastModified: i.date, priority: 0.5 })),
  ];
}
