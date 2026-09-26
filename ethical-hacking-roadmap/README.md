# Ethical Hacking Roadmap — PAN Home Lab Edition

A static, read-only reference site for your 9-phase home lab roadmap (Phase 00
Foundations through Phase 08 Formal Track). It's a frontend-only React +
Tailwind app — no backend, no login, no data storage.

Each phase shows:

- **At a glance** — the short objective list from the roadmap
- **Notes** — classroom-style teaching content for that phase: concepts
  explained, example commands and payloads, and what to actually look for,
  so you're not tabbing back to TryHackMe just to check syntax
- **Reference on TryHackMe** — room / path names to work the guided exercises
  for that phase
- **Field journal** — reflection questions to answer yourself, in your own
  notes, while you do the actual work on your machine and VMs

Nothing on the page is interactive beyond picking which phase to look at —
there are no checkboxes, forms, or saved progress. It's meant to sit open in
a tab next to your terminal as a reference sheet, not to track anything for
you.

## Run it locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

## Build a static bundle

```bash
npm run build
npm run preview
```

The production build lands in `dist/` and can be hosted anywhere that serves
static files.

## Edit the content

All the phase content — objectives, teaching notes, example commands, THM
references, and journal questions — lives in `src/data.js`. Update that file
as your roadmap evolves; the layout in `src/App.jsx` doesn't need to change.
