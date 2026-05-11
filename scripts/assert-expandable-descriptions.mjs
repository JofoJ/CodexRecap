import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import assert from "node:assert/strict";

const appSource = await readFile(resolve("src/App.tsx"), "utf8");

for (const requiredText of [
  "Show full description",
  "Show less",
  "expandedDescriptions",
  "description-toggle",
]) {
  assert.ok(appSource.includes(requiredText), `missing expandable description code: ${requiredText}`);
}

console.log("Expandable description check passed.");
