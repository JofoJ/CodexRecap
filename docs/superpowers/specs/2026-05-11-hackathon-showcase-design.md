# AITX Codex Hackathon Showcase Design

## Goal

Build a lightweight, Vercel-ready website that showcases AITX <> Codex Community Hackathon submissions from `/Users/jakeoshea/Downloads/Submissions-Codex Hackathon.csv`.

## Direction

Use the approved Editorial Gallery concept: a polished first viewport with strong event identity, concise data highlights, featured submissions, and a searchable/filterable gallery of builds.

## Content

The site will use the CSV as the source of truth and normalize these fields:

- Submission name and description
- Demo video and GitHub repository links
- Tracks
- Team members
- Judge average and community choice votes
- Bounties and bounty context
- DGX Spark usage notes
- Hack fair station and created date where useful

## Experience

The first screen will show the hackathon name, a short framing line, summary stats, and featured builds. The gallery will include project cards with badges, scores, descriptions, team names, and buttons for demos and repositories. Users can search by project, team, track, bounty, or description, and filter by All, Agents, AutoHDR, Open Data, and Bounties.

## Architecture

Use a static Vite + React app with local JSON data generated from the CSV. No backend or runtime API is required. The output should deploy cleanly to Vercel as a standard static frontend.

## Verification

Run dependency install, generate normalized data, build the app, and inspect the local site in the browser at desktop and mobile-ish widths.
