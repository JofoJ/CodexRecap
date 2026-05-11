import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const csvPath = process.env.SUBMISSIONS_CSV
  ? resolve(process.env.SUBMISSIONS_CSV)
  : "/Users/jakeoshea/Downloads/Submissions-Codex Hackathon.csv";
const outputPath = resolve("src/data/submissions.json");
const submissionOverrides = new Map([
  [
    "TEAM NAME = OBJECTS! - PROJECT = OBJECT ORIENTED VIDEOGRAPHY",
    {
      name: "OBJECT ORIENTED VIDEOGRAPHY",
      demoVideo: "https://www.loom.com/share/ce87f1c0d49241dca709f37fe8c5ad53",
    },
  ],
  [
    "Texas County Battle",
    {
      demoVideo: "",
    },
  ],
]);

function parseCsv(input) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1];

    if (quoted) {
      if (char === '"' && next === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        cell += char;
      }
      continue;
    }

    if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell.replace(/\r$/, ""));
    rows.push(row);
  }

  return rows;
}

function splitList(value) {
  return value
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeTrack(track) {
  if (/autohdr/i.test(track)) return "AutoHDR";
  if (/open data|brainforge|vicinity/i.test(track)) return "Open Data";
  if (/agents/i.test(track)) return "Agents";
  return track.replace(/\s*Track$/i, "").trim();
}

function cleanText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value) {
  return cleanText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeDemoVideo(value) {
  const url = cleanText(value);
  const loomMatch = url.match(/loom\.com\/(?:share|edit)\/([a-zA-Z0-9]+)/);
  if (loomMatch) return `https://www.loom.com/share/${loomMatch[1]}`;
  return url;
}

function demoEmbedUrl(value) {
  const url = cleanText(value);
  const loomMatch = url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/);
  if (loomMatch) return `https://www.loom.com/embed/${loomMatch[1]}`;

  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveMatch) return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;

  return "";
}

function loomShareId(value) {
  return cleanText(value).match(/loom\.com\/share\/([a-zA-Z0-9]+)/)?.[1] ?? "";
}

function driveFileId(value) {
  return cleanText(value).match(/drive\.google\.com\/file\/d\/([^/]+)/)?.[1] ?? "";
}

async function demoMetadata(value) {
  const url = cleanText(value);
  const loomId = loomShareId(url);
  if (loomId) {
    try {
      const response = await fetch(
        `https://www.loom.com/v1/oembed?url=${encodeURIComponent(url)}`,
      );
      if (response.ok) {
        const payload = await response.json();
        return {
          demoProvider: "Loom",
          demoThumbnailUrl: cleanText(payload.thumbnail_url),
        };
      }
    } catch {
      return {
        demoProvider: "Loom",
        demoThumbnailUrl: "",
      };
    }

    return {
      demoProvider: "Loom",
      demoThumbnailUrl: "",
    };
  }

  const driveId = driveFileId(url);
  if (driveId) {
    return {
      demoProvider: "Google Drive",
      demoThumbnailUrl: `https://drive.google.com/thumbnail?id=${driveId}&sz=w1200`,
    };
  }

  return {
    demoProvider: "",
    demoThumbnailUrl: "",
  };
}

function normalizeLinkedinUrl(value) {
  const trimmed = value.trim().replace(/[),.\]]+$/g, "");
  if (!trimmed || /no linkedin/i.test(trimmed)) return "";
  const withoutProtocol = trimmed.replace(/^https?:\/\//i, "");
  if (!/^((www\.)?linkedin\.com\/in\/)/i.test(withoutProtocol)) return "";
  return `https://${withoutProtocol}`.replace(/\/?$/, "/");
}

function parseAttendees(value) {
  return String(value || "")
    .split(/(?=\b\d+\)\s)|\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const linkedinMatch = line.match(
        /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?/i,
      );
      const linkedin = linkedinMatch ? normalizeLinkedinUrl(linkedinMatch[0]) : "";
      const beforeLinkedin = linkedinMatch ? line.slice(0, linkedinMatch.index) : line;
      const withoutNumber = beforeLinkedin.replace(/^\s*\d+\)\s*/, "");
      const withoutBracket = withoutNumber.replace(/^\[|\]$/g, "");
      const name = withoutBracket
        .split(/\s+-\s+|,\s*/)
        .map((part) => part.trim())
        .find((part) => part && !part.includes("@") && !/^https?:/i.test(part));

      return {
        name: cleanText(name || withoutBracket).replace(/[-,]+$/g, "").trim(),
        linkedin,
      };
    })
    .filter((attendee) => attendee.name && !attendee.name.includes("@"));
}

const raw = await readFile(csvPath, "utf8");
const rows = parseCsv(raw.replace(/^\uFEFF/, "")).filter((row) =>
  row.some((cell) => cell.trim()),
);
const headers = rows[0].map((header) => header.trim());
const records = rows.slice(1).map((row) =>
  Object.fromEntries(headers.map((header, index) => [header, row[index] || ""])),
);

const submissions = (
  await Promise.all(
    records.map(async (row, index) => {
    const rawName = cleanText(row["Submission Name"]);
    const override = submissionOverrides.get(rawName);
    const name = override?.name ?? rawName;
    const demoVideo = normalizeDemoVideo(override?.demoVideo ?? row["Demo Video"]);
    const metadata = await demoMetadata(demoVideo);
    const tracks = splitList(row.Tracks || "").map(normalizeTrack);
    const bounties = splitList(row.Bounties || "");

    return {
      id: slugify(name || `submission-${index + 1}`),
      name: name || `Submission ${index + 1}`,
      description: cleanText(row["Submission Description"]),
      demoVideo,
      demoEmbedUrl: demoEmbedUrl(demoVideo),
      ...metadata,
      tracks: Array.from(new Set(tracks)).filter(Boolean),
      attendees: parseAttendees(row["List Team Members"]),
      githubRepo: cleanText(row["Github Repo"]),
      bounties,
      showcaseWorthy: cleanText(row["Showcase worthy?"]),
    };
    }),
  )
).filter((submission) => submission.name && submission.description);

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(submissions, null, 2)}\n`);
console.log(`Wrote ${submissions.length} submissions to ${outputPath}`);
