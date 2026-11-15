# Prasham Soni: Portfolio

React + TypeScript + Vite + Tailwind CSS v4. Single-page scroll portfolio.

## Direction (Nov 2026 cleanup)

The site was rebuilt to be **clean and light**, first modelled on https://aryanshah.work/ (cards, type, layout rhythm), then taken in its own direction (see Trail map below). The earlier "awwwards" build was removed for draining memory and not working well: the canvas optical-flow hero (`FlowField`), the perception photo slideshow (`PerceptionScene` + `public/perception/`), the DETECT overlay mode, the boot `Loader`, the film `Grain`, Lenis smooth scroll, and the `Words` / `Scramble` / `Magnetic` / `ScanReveal` effects. **Do not reintroduce canvas loops, rAF effects, overlays, loaders or scroll hijacking.**

Look, taken from the reference:
- Warm paper background (`#fbfaf6`), ink text (`#0a0a0a`, muted `#404040`), hairline borders (`#e4dfd3`). **Light by default** (like the reference, which is light-only); dark only if the visitor toggles it (`index.html` script + `useTheme.ts`). The dot grid was removed by request; the only background is the contour map.
- One accent, `--color-brand` (deep crimson `#960d26`, `#fb7185` in dark), used for section labels and link hovers only.
- Font: **Geist** (`@fontsource/geist`) for everything; JetBrains Mono 400 for small metadata.
- **Centered `max-w-5xl` column** with `px-5 sm:px-8`. (This replaces the old full-width rule.)
- Section = small brand-coloured label + plain 30-36px semibold title + optional lede (`Section.tsx`). Sections are separated by a hairline `border-t`.
- Motion: only `Rise` in `motion.tsx` (short fade-up, once). Native `scroll-behavior: smooth`.

## Structure

- `src/data/*.ts`: all content (profile, experience, projects, awards, publications). Edit these to update the site.
- `src/components/*.tsx`: Hero, About, Journey, Projects, Recognition, Contact, plus `Section`, `Nav`, `ThemeToggle`, `icons`, `motion`.
- Order: Hero → About → Experience (`Journey.tsx`, `#journey`) → Projects → Awards (`Recognition.tsx`) → Contact.
- `Journey.tsx` merges `experience.ts` with `education` from `profile.ts`, sorted by the first "Mon YYYY" in `dates`. Logos sit on white plates (`logoScale` per entry balances square marks against wordmarks).
- `Projects.tsx`: filter pills over a **1/2/3-column grid of compact cards copied from the reference**: 16:10 media filling the frame, domain chips overlaid top-left, GitHub chip top-right, then three short lines (uppercase `context`, title, first metric · year). No summary or tech chips on cards; that detail is in the case-study modal (media gallery + Problem / Approach / Result). Card leads should MOVE where the project has motion (animated WebP or muted mp4): the user complained when animated leads were swapped for stills.
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
- **Design concept (Nov 2026): the "Trail map".** The user rejected replicating aryanshah.work ("replicating Aryan's website is bad, make something new, unique and interesting") and chose this from three concepts. The idea: a hiking route through a career. Pieces: a static contour-map SVG as the page background (`public/trail/contours.svg`, generated once by a script, drawn by `.trail-bg` in `index.css`, light and fixed, no JS); sections labelled as waypoints ("▲ WP 03 / PROJECTS", numbering in `Section.tsx`) with dashed trail rules between them; the hero is a "trailhead" (location and coordinates, name, punchline) beside a pinned polaroid-style print of the user at Yosemite (`public/trail/overlook.webp`); Experience is the winding route in `Journey.tsx` (see below; an earlier elevation-profile chart was rejected); `OffTrail.tsx` is a photo strip of the user's own photos with short captions. Palette is warm paper (`#fbfaf6`) with the crimson `--color-brand` as the trail blaze. Keep additions static SVG/CSS; no canvas or scroll hijacking.
- Rejected on the way to this: a stock robot-cell hero photo, the user's photo washed over half the hero, an Unsplash sunset backdrop plus captioned portrait (that was copying Aryan), and a dot-grid background.
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
- Warehouse robot count conflict: the CV says 4 mobile robots, the project card says 3 AMRs (from the old Google Sites page); unresolved, ask the user.
- AGV card lead (`memflow/lead-anim.webp`) is built from the first 32 frames of the original clip only: later frames show a worker's face. Never use the full clip or `back_annotated` frames in animation. NeRF lead is trimmed and `fit: 'contain'`.
- Experience (`Journey.tsx`) is the **winding route**: one curving trail with a waypoint per role, each leg filling crimson as it scrolls (px SVG per row, re-measured with ResizeObserver). It replaced the elevation-profile chart, which the user rejected. React keys use company+role (two Tesla roles).
- `fanuc-handling` (side project video, `public/projects/fanuc-side/demo.mp4`) has no case-study text yet: the modal shows only an Overview. Fill problem/approach/result when the user explains it.
- Flipkart Grid (warehouse) has no still image. Experience text mirrors the latest CV, `CV_Prasham_Soni_vision_robo_14_11_2026.pdf` (live copy: `public/Prasham_Soni_Resume.pdf`, link cache-busted with `?v=` in `profile.ts`; bump it when the PDF changes): Tesla full-time (Robotics & Vision Systems Engineer, Optimus Program, Aug 2026 – Present) above the Jan–May 2026 internship. The user is now employed, so the hero status line names the Tesla role, not "open to roles". Reliance, Nutron and the Rivian Controls Integration Lead bullet come from the old site and are kept.
