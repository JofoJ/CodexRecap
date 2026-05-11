import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import assert from "node:assert/strict";

const publicDataPath = resolve("src/data/submissions.json");
const submissions = JSON.parse(await readFile(publicDataPath, "utf8"));
const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;

assert.ok(Array.isArray(submissions), "submissions data should be an array");

for (const [submissionIndex, submission] of submissions.entries()) {
  assert.ok(
    !("teamMembers" in submission),
    `raw teamMembers text was present on submission index ${submissionIndex}`,
  );
  assert.ok(
    Array.isArray(submission.attendees),
    `attendees should be an array on submission index ${submissionIndex}`,
  );

  for (const [attendeeIndex, attendee] of submission.attendees.entries()) {
    assert.equal(
      Object.keys(attendee).sort().join(","),
      "linkedin,name",
      `attendee ${attendeeIndex} on submission ${submissionIndex} should only expose name and linkedin`,
    );
    assert.ok(attendee.name, `attendee ${attendeeIndex} should include a name`);
    assert.ok(
      !emailPattern.test(JSON.stringify(attendee)),
      `attendee ${attendeeIndex} on submission ${submissionIndex} exposed an email`,
    );
    if (attendee.linkedin) {
      assert.match(
        attendee.linkedin,
        /^https:\/\/(www\.)?linkedin\.com\/in\/[^/\s]+\/?$/i,
        `attendee ${attendeeIndex} on submission ${submissionIndex} has invalid LinkedIn URL`,
      );
    }
  }
}

const reelStudio = submissions.find((submission) => submission.name === "ReelStudio");
assert.ok(reelStudio, "ReelStudio should be present");
assert.equal(reelStudio.attendees.length, 3, "ReelStudio should list three attendees");

const txMoney = submissions.find(
  (submission) => submission.name === "TxMoney - Follow the Money",
);
assert.ok(txMoney, "TxMoney should be present");
assert.equal(
  txMoney.attendees.find((attendee) => attendee.name === "Alex Hurley")?.linkedin,
  "https://www.linkedin.com/in/alexander-hurley1258/",
  "Hyphenated LinkedIn profile slugs should not be truncated",
);

console.log(`Public team data check passed for ${submissions.length} submissions.`);
