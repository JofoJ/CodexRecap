import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import assert from "node:assert/strict";

const publicDataPath = resolve("src/data/submissions.json");
const submissions = JSON.parse(await readFile(publicDataPath, "utf8"));
const loomSubmissions = submissions.filter((submission) =>
  String(submission.demoVideo || "").includes("loom.com/share/"),
);

assert.ok(loomSubmissions.length > 0, "expected at least one Loom demo URL");

for (const submission of loomSubmissions) {
  assert.match(
    submission.demoEmbedUrl || "",
    /^https:\/\/www\.loom\.com\/embed\/[a-zA-Z0-9]+/,
    `${submission.name} should expose a Loom embed URL`,
  );
  assert.match(
    submission.demoThumbnailUrl || "",
    /^https:\/\/cdn\.loom\.com\/sessions\/thumbnails\//,
    `${submission.name} should expose a Loom thumbnail URL`,
  );
}

console.log(`Loom embed check passed for ${loomSubmissions.length} submissions.`);
