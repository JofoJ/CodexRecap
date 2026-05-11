import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import assert from "node:assert/strict";

const appSource = await readFile(resolve("src/App.tsx"), "utf8");

for (const requiredText of [
  "Total Tokens Used",
  "4.66B",
  "Total Model Requests",
  "56,415",
  "Winning Builds",
  "Manifold - Natural Language Space Mission Designer",
  "OBJECT ORIENTED VIDEOGRAPHY",
  "TxMoney - Follow the Money",
]) {
  assert.ok(appSource.includes(requiredText), `missing homepage copy: ${requiredText}`);
}

assert.ok(!appSource.includes("Demo links"), "old Demo links stat should be removed");
assert.ok(!appSource.includes("Repos</span>"), "Repos stat card should be removed");
assert.ok(!appSource.includes('uniqueTrackCount()'), "Tracks stat card should be removed");

console.log("Homepage content check passed.");
