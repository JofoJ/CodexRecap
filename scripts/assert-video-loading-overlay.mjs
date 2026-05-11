import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import assert from "node:assert/strict";

const appSource = await readFile(resolve("src/App.tsx"), "utf8");
const cssSource = await readFile(resolve("src/styles.css"), "utf8");

assert.ok(appSource.includes("readyVideos"), "video readiness state should exist");
assert.ok(appSource.includes("fallbackVideos"), "video fallback state should exist");
assert.ok(
  appSource.includes("Loading embedded player..."),
  "loading overlay copy should exist",
);
assert.ok(appSource.includes("Open demo"), "video fallback action should exist");
assert.ok(
  cssSource.includes(".video-loading-overlay"),
  "loading overlay styles should exist",
);
assert.ok(
  cssSource.includes(".video-fallback-overlay"),
  "fallback overlay styles should exist",
);

console.log("Video loading overlay check passed.");
