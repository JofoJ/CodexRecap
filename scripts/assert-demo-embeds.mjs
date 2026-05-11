import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import assert from "node:assert/strict";

const submissions = JSON.parse(
  await readFile(resolve("src/data/submissions.json"), "utf8"),
);

for (const submission of submissions) {
  assert.ok(
    !String(submission.demoVideo || "").includes("loom.com/edit/"),
    `${submission.name} should not expose Loom edit URLs`,
  );

  if (submission.demoVideo?.includes("loom.com/")) {
    assert.match(
      submission.demoEmbedUrl,
      /^https:\/\/www\.loom\.com\/embed\/[a-zA-Z0-9]+$/,
      `${submission.name} should have a Loom embed URL`,
    );
    assert.equal(submission.demoProvider, "Loom");
    assert.match(
      submission.demoThumbnailUrl,
      /^https:\/\/cdn\.loom\.com\/sessions\/thumbnails\//,
      `${submission.name} should have a Loom thumbnail URL`,
    );
  }

  if (submission.demoVideo?.includes("drive.google.com/")) {
    assert.match(
      submission.demoEmbedUrl,
      /^https:\/\/drive\.google\.com\/file\/d\/[^/]+\/preview$/,
      `${submission.name} should have a Google Drive preview embed URL`,
    );
    assert.equal(submission.demoProvider, "Google Drive");
    assert.match(
      submission.demoThumbnailUrl,
      /^https:\/\/drive\.google\.com\/thumbnail\?/,
      `${submission.name} should have a Google Drive thumbnail URL`,
    );
  }
}

const clawGods = submissions.find(
  (submission) => submission.name === "Team ClawGods - ReproLab",
);
assert.ok(clawGods, "Team ClawGods should be present");
assert.equal(
  clawGods.demoVideo,
  "https://www.loom.com/share/19cc4ebffe9748ad8c4d2d7119fecdbd",
);
assert.equal(
  clawGods.demoEmbedUrl,
  "https://www.loom.com/embed/19cc4ebffe9748ad8c4d2d7119fecdbd",
);

const samRail = submissions.find((submission) => submission.name === "SamRail");
assert.ok(samRail, "SamRail should be present");
assert.equal(
  samRail.demoEmbedUrl,
  "https://drive.google.com/file/d/1deQn7OBRKqfEq2_Y8paQDUnmlvuPi9AM/preview",
);

const texasCountyBattle = submissions.find(
  (submission) => submission.name === "Texas County Battle",
);
assert.ok(texasCountyBattle, "Texas County Battle should be present");
assert.equal(texasCountyBattle.demoVideo, "");
assert.equal(texasCountyBattle.demoEmbedUrl, "");

console.log("Demo embed check passed.");
