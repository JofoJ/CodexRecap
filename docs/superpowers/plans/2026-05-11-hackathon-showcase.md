# Hackathon Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static Editorial Gallery website for the AITX <> Codex Community Hackathon submissions.

**Architecture:** Use Vite + React with a generated local JSON data file derived from the CSV. Keep filtering and search client-side so the site remains trivial to host on Vercel.

**Tech Stack:** Vite, React, TypeScript, CSS, Node script for CSV normalization.

---

## File Structure

- `package.json`: scripts and dependencies.
- `index.html`: app entry shell.
- `src/main.tsx`: React mount point.
- `src/App.tsx`: gallery, filters, stats, featured builds.
- `src/styles.css`: responsive editorial visual system.
- `src/data/submissions.json`: generated normalized submission data.
- `scripts/prepare-data.mjs`: CSV parser and normalizer.
- `public/`: static assets if needed.

## Tasks

### Task 1: Scaffold Static App

- [ ] Create Vite + React + TypeScript project files.
- [ ] Add scripts for `dev`, `build`, `preview`, and `prepare:data`.
- [ ] Add `.gitignore` for dependencies, build output, and brainstorm artifacts.

### Task 2: Normalize CSV Data

- [ ] Implement a small CSV parser that handles quoted multiline fields.
- [ ] Normalize tracks, bounties, links, scores, votes, team members, descriptions, and DGX notes.
- [ ] Generate `src/data/submissions.json` from the user-provided CSV path.

### Task 3: Build Editorial Gallery UI

- [ ] Render hero stats and featured projects.
- [ ] Render searchable/filterable project cards.
- [ ] Include demo and GitHub actions where links exist.
- [ ] Add badges for tracks and bounties.

### Task 4: Style Responsively

- [ ] Apply the approved Editorial Gallery visual direction.
- [ ] Ensure card text wraps cleanly across desktop and mobile.
- [ ] Keep the page lightweight, fast, and deployable without server logic.

### Task 5: Verify

- [ ] Install dependencies.
- [ ] Run data generation.
- [ ] Run production build.
- [ ] Launch the dev server and inspect the site in the in-app browser.
