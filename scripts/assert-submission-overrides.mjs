import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import assert from "node:assert/strict";

const submissions = JSON.parse(
  await readFile(resolve("src/data/submissions.json"), "utf8"),
);

const objectVideography = submissions.find(
  (submission) => submission.name === "OBJECT ORIENTED VIDEOGRAPHY",
);

assert.ok(objectVideography, "OBJECT ORIENTED VIDEOGRAPHY should be present");
assert.equal(
  objectVideography.demoVideo,
  "https://www.loom.com/share/ce87f1c0d49241dca709f37fe8c5ad53",
);
assert.equal(
  objectVideography.demoEmbedUrl,
  "https://www.loom.com/embed/ce87f1c0d49241dca709f37fe8c5ad53",
);
assert.match(
  objectVideography.demoThumbnailUrl,
  /^https:\/\/cdn\.loom\.com\/sessions\/thumbnails\/ce87f1c0d49241dca709f37fe8c5ad53-/,
);
assert.equal(
  objectVideography.id,
  "object-oriented-videography",
  "renamed build should get a matching anchor id",
);

console.log("Submission override check passed.");
