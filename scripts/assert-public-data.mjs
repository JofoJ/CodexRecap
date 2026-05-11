import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import assert from "node:assert/strict";

const publicDataPath = resolve("src/data/submissions.json");
const submissions = JSON.parse(await readFile(publicDataPath, "utf8"));

const restrictedKeys = [
  "dgxUsage",
  "modelsUsed",
  "toolsUsed",
  "uniqueSparkApplications",
  "communityChoicePost",
  "submissionScoring",
  "scoringTotal",
  "judgeAverage",
  "communityChoiceVotes",
  "communityVotes",
  "bountyContext",
  "hackathon",
  "station",
  "created",
  "nemoclaw",
  "devRoundtableAttendee",
  "hardwareExperience",
];

assert.ok(Array.isArray(submissions), "submissions data should be an array");

for (const [index, submission] of submissions.entries()) {
  for (const key of restrictedKeys) {
    assert.ok(
      !(key in submission),
      `restricted key "${key}" was present on submission index ${index}`,
    );
  }
}

console.log(`Public data check passed for ${submissions.length} submissions.`);
