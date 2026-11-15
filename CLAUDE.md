# Prasham Soni: Portfolio

React + TypeScript + Vite + Tailwind CSS v4. Single-page scroll portfolio.

## Direction (Nov 2026 cleanup)

The site was rebuilt to be **clean and light**, modelled on https://aryanshah.work/ (by user request). The earlier "awwwards" build was removed for draining memory and not working well: the canvas optical-flow hero (`FlowField`), the perception photo slideshow (`PerceptionScene` + `public/perception/`), the DETECT overlay mode, the boot `Loader`, the film `Grain`, Lenis smooth scroll, and the `Words` / `Scramble` / `Magnetic` / `ScanReveal` effects. **Do not reintroduce canvas loops, rAF effects, overlays, loaders or scroll hijacking.**

Look, taken from the reference:
- Flat white background (`#fff`), ink text (`#0a0a0a`, muted `#404040`), hairline borders (`#e8e8e8`). Dark mode kept as a toggle.
- One accent, `--color-brand` (deep crimson `#960d26`, `#fb7185` in dark), used for section labels and link hovers only.
- Font: **Geist** (`@fontsource/geist`) for everything; JetBrains Mono 400 for small metadata.
- **Centered `max-w-5xl` column** with `px-5 sm:px-8`. (This replaces the old full-width rule.)
- Section = small brand-coloured label + plain 30-36px semibold title + optional lede (`Section.tsx`). Sections are separated by a hairline `border-t`.
- Motion: only `Rise` in `motion.tsx` (short fade-up, once). Native `scroll-behavior: smooth`.

## Structure

- `src/data/*.ts`: all content (profile, experience, projects, awards, publications). Edit these to update the site.
- `src/components/*.tsx`: Hero, About, Journey, Projects, Recognition, Contact, plus `Section`, `Nav`, `ThemeToggle`, `icons`, `motion`.
- Order: Hero (type-only: role line, name, punchline, tagline, View projects + Résumé, status) → About → Experience (`Journey.tsx`, `#journey`) → Projects → Awards (`Recognition.tsx`) → Contact.
- `Journey.tsx` merges `experience.ts` with `education` from `profile.ts`, sorted by the first "Mon YYYY" in `dates`. Logos sit on white plates (`logoScale` per entry balances square marks against wordmarks).
- `Projects.tsx`: domain filter pills over a 2-column card grid (`Card`: media, domain pills, year, title, summary, 4 tech chips). A card opens the case-study modal (Problem / Approach / Result + metric chips).
- `src/hooks/useTheme.ts`: dark/light, persisted to `localStorage`.
- `public/projects/<slug>/`: project media, referenced by absolute path in `projects.ts`. `public/logos/`: company logos. `public/Prasham_Soni_Resume.pdf`.

## Domain system

Tags `Robotics`, `Perception`, `Robotics AI`, `Controls` (`Domain` in `projects.ts`; Controls added Nov 2026 by request, teal), colours in `index.css` (`--color-perception`, `--color-robotics`, `--color-robotics-ai`, `--color-controls` + `-soft`), consumed via `domainColor`. Each domain is a filter pill on Projects and a skills row in About (`skillDomains` in `profile.ts`). Project reports live in `public/reports/` and are linked from a project's `links`. **Used only as small tags/dots**, not as page colour.

## Adding content

- Project: add to `projects` in `src/data/projects.ts` with `domains`, one-line `summary`, `problem`, `approach`, `result`, optional `metrics`. `image: ''` renders a placeholder.
  - `image` is the card thumbnail: prefer a real photo, render or output frame over a plot (plots made the site read as coursework). Cards fill the frame (`object-cover`); set `fit: 'contain'` for plots/diagrams so they sit uncropped on white.
  - `gallery` adds more media (images or short muted `.mp4` clips) shown as a thumbnail strip in the case-study modal. Keep clips around 8 s, 960 px wide, no audio.
  - **No identifiable faces** in any project media (fall-detection demo and most front-camera MemFlow frames were skipped for this).
- Removed by request: SafeCeil fall detection ("dumb and useless"), the RBE501 dynamics and RBE502 quadrotor cards (no media). Don't re-add.
- Hero background: an Unsplash industrial robot-cell photo (`public/hero/`, credit in `public/hero/CREDITS.md`), faded under gradients into the page colour, Aryan-style, by user request. A washed photo of the user's own desk was tried first and read as muddy. The rest of the page uses the `.page-dots` plate.
- Raw media for projects lives on this PC: `D:\Projects\WPI_Random_Projects` (EinsteinVision clips S*_trim, output_video, VIO talk), `Desktop/For Github/EV` (EinsteinVision phases), `Desktop/Prasham Soni/Ayna_raft_AWS/ayna-memflow` (MemFlow frames), `Desktop/WPI/Humanoid_project/renders`.
- Experience: add to `experience` in `src/data/experience.ts` with `logo`, `headline`, `stack`, optional `stats`.

## Copy register (important)

Professional, not literary. One exception, by user request (Nov 2026): the hero punchline is a dry, satirical one-liner ("Making robots slightly less confident and considerably more correct."). Keep the wit to that line only. Section titles are plain nouns. Never imply a fixed inventory ("nine projects"). Positioning is robotics / autonomy / perception, weighted equally; Tesla and Rivian are evidence, not identity. **No em dashes anywhere** (`grep -rn "—" src/ index.html` must be empty).

## Commands

- `npm run dev`, `npm run build` (tsc -b + vite), `npm run preview`.
- `npm run optimize:media` converts GIFs under `public/projects/` to animated WebP.
- `npm run build:autopano` regenerates the MyAutoPano GIF (uses `sharp`).

## Content sources

Old Google Sites portfolio (https://sites.google.com/view/prashamsoni/home, /projects, /experience, /blogs) is the canonical source for older content and media. LinkedIn cannot be fetched (HTTP 999).

## Known gaps / next

- No GIFs on the site: animated media is animated WebP (max 960px). Drop a new GIF into `public/projects/<slug>/`, run `npm run optimize:media`, point `projects.ts` at the `.webp` and delete the GIF.
- `Assets/` (848 MB raw media) is tracked in git; consider untracking or git-lfs.
- `robot-dynamics` (RBE501) and `quadrotor-control` (RBE502) have no image yet; sources are under `Desktop/WPI/Sem2_spring_2025/Robot Dynamics` and `Desktop/WPI/Sem1_fall_2024/Robot_control`. Project source folders on this PC: `Desktop/WPI/Humanoid_project`, `Desktop/Fall 2025/Advanced_robot_navigation`, `Desktop/For Github/*`, `Desktop/WPI/PEAR_Lab/*`.
- Flipkart Grid (warehouse) has no still image. Tesla internship ended May 2026.
