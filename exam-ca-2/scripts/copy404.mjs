import { copyFileSync } from "node:fs";
try {
  copyFileSync("dist/index.html", "dist/404.html");
  console.log("Created dist/404.html for SPA fallback.");
} catch (e) {
  console.error("Failed to create 404.html:", e);
  process.exit(1);
}
