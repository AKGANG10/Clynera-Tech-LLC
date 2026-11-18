import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";
import { visualSrc, type VisualKey } from "@/content/visuals";

/** True when the slot's image has been imported (checked at build time). */
export const hasVisual = (key: VisualKey) => existsSync(path.join(process.cwd(), "public", visualSrc(key)));
