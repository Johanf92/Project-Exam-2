import { copyFileSync } from "node:fs";

/**
 * @file Build helper — ensures a `404.html` exists for SPA deployments.
 * Copies `dist/index.html` to `dist/404.html` so that unknown routes
 * fall back to the single-page app entry point.
 */

try {
  copyFileSync("dist/index.html", "dist/404.html");
  console.log("Created dist/404.html for SPA fallback.");
} catch (e) {
  console.error("Failed to create 404.html:", e);
  process.exit(1);
}
