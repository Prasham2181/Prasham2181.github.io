# Prasham Soni — Portfolio

React + TypeScript + Vite + Tailwind CSS v4. Single-page scroll portfolio.

## Structure

- `src/data/*.ts` — all content (profile, experience, projects, publications). Edit these to update the site; no component changes needed to add/edit an entry.
- `src/components/*.tsx` — one component per section (Hero, About, Journey, Projects, Recognition, Contact), plus shared bits: `Section` wrapper, `Nav`, `ThemeToggle`, `icons` (inline brand SVGs lucide-react dropped). (A fixed `StatusBar` clock/weather widget existed and was removed as unnecessary.)
- Section order/numbering: Hero (full-viewport, kept clean by request, no badges/stats) → 01 About → 02 Journey → 03 Projects → 04 Recognition → 05 Contact. A "Now / Next" section existed briefly; the user asked for it to be removed entirely, so don't re-add. The `FieldFeed` band is also gone: the user said the detection-on-photos idea "looks like a section rather than an interactive element integrated in the webpage", so `PerceptionScene` now lives *inside* About as fig. 01 and the detection idea became `DetectOverlay` (see below).
- Sections are **not** each `min-h-screen` any more. That made the page read as a slideshow. They use an editorial rhythm (`py-24 sm:py-32`) opened by a hairline rule that draws itself in. `Section.tsx` lays each one out as a two-column spread: a **sticky** mono index/eyebrow column (`md:sticky top-24`) and the content column holding the oversized title, an optional `lede`, and children. Children therefore no longer need `md:pl-56`; they sit in the content column already.
- Shared motion primitives live in `src/components/motion.tsx`: `Words` (word-by-word mask reveal for headings), `Rise` (staggered fade-up for everything else), `Magnetic` (cursor pull, primary CTAs only), `Scramble` (character decode for **mono labels only**, the typographic echo of the hero scan), `ScanReveal` (clip-path wipe plus settle, for images).
- `Loader.tsx` is a short boot sequence framed as a sensor coming online. It runs once per tab via `sessionStorage`. `Grain.tsx` is a fixed film-grain plate. `useSmoothScroll.ts` wires Lenis (which is why `scroll-behavior: smooth` is gone from `index.css`; the two fight and stutter).
- `Journey.tsx` (section title "Trajectory") is a chronological flat-row timeline merging `experience.ts` with `education` from `profile.ts`, sorted by the first "Mon YYYY" in each `dates` string. Rows are: split start/end dates · **framed logo tile** · role/company · headline · stat chips + stack chips, with expandable bullets behind a rotating `+`. A scroll-linked rail on the left fills with a domain-colour gradient and each row has a node on it. An earlier boxed-cards-on-a-rail layout was rejected as "not polished"; keep the flat editorial style.
  - **Logo plates**: company marks are dark-on-transparent artwork at unrelated aspect ratios (square Tesla T vs a 4.8:1 Keepsake wordmark), so `LogoPlate` mounts each on a permanent **white plate** (dark marks otherwise vanish in dark mode) in a **landscape 96×64 box** wide enough for a wordmark, `object-contain`, in full colour. Each entry carries a `logoScale` in `experience.ts` so a square mark and a wordmark read at the same optical weight; retune it when a logo is swapped. Tesla is the **T symbol**, not the wordmark, by user request.
- `Recognition.tsx` merges `awards.ts` with `publications.ts` into one list (year · title · detail rows), replacing the old Publications section.
- UI micro-polish follows the `make-interfaces-feel-better` skill installed at `.agents/skills/` (tabular-nums on dates, `text-wrap: balance` on headings, `active:scale-[0.96]` on buttons, no `transition-all`).
- `Projects.tsx`: full-width **editorial rows** (`ProjectRow`), one project per row, `sm:grid-cols-[13rem_minmax(0,1fr)_auto]`: a small 16:10 thumbnail · number+title+summary+tech · domains+year+arrow. Compact and strictly aligned (this is the *fourth* projects layout: 3-up grid, 2-up big cards, and an index+sticky-preview split were all rejected in turn as "too big" / "not refined and bad"; keep it a clean row list). Selecting a row opens the case-study modal (**Problem / Approach / Result** + metric chips, the four fields on each `Project`). No per-card scan/stagger transitions (removed on request). No featured/lead card, no filter counts. NOTE: a haoqi.design barrel-scroll list + custom cursor was rejected ("too bad") — these rows are static, no scroll-tilt, no custom cursor. Section is eyebrow "Work" / title "Projects & research" ("Selected projects" and several cleverer titles were rejected).
- `Nav.tsx` has a scroll progress bar (domain-color gradient), IntersectionObserver-based active-section highlighting, and the **DETECT** toggle.
- `src/hooks/useTheme.ts` — dark/light mode, persisted to `localStorage`.
- `public/projects/<slug>/` — project images/video, referenced by absolute path (e.g. `/projects/nerf/hero.gif`) in `src/data/projects.ts`.
- `public/logos/*` — company logos for Experience, transparent PNG where available.
- `public/Prasham_Soni_Resume.pdf` — downloadable résumé linked from the Hero.

## Domain system

Three tags run through the whole site: `Robotics`, `Perception`, `Robotics AI` (see `Domain` type in `src/data/projects.ts`). Colors for each live in `src/index.css` (`--color-perception`, `--color-robotics`, `--color-robotics-ai` + `-soft` variants) and are consumed via the `domainColor` export from `projects.ts`. Used for: Project card badges + filter tabs, About's Skills cards, Hero's eyebrow tag line.

## Adding a project

Add an entry to the `projects` array in `src/data/projects.ts`. Required: `domains: Domain[]`, a one-line `summary`, and the three case-study fields the modal renders (`problem`, `approach`, `result`). Optional: `metrics` (chips). Leave `image: ''` if no asset is available yet: the index thumbnail and preview render a "No preview" placeholder automatically. There is no `featured` field: a lead card was rejected.

## Adding an experience entry

Add to `experience` in `src/data/experience.ts`, including a `logo` path into `public/logos/`, a one-line `headline`, a `stack` array (tool chips), and optional `stats` (metric chips). Logos render inside `LogoTile`, which is a white plate, so a transparent-background PNG works in either theme.

## Copy register (important)

The site is **professional**, not literary. A pass of writerly copy ("A model is not a system", "Nine ways of asking where something is", "Judged, funded, published", metric blocks with essayistic captions) was rejected wholesale: "content is bad", "the idea was to add fun elements which can be interacted via ui ux **not fun content**, content needs to be professional as the portfolio is professional".

Rules that follow from that:

- Section titles are plain nouns ("Career trajectory", "Selected projects", "Awards & publications", "Get in touch"). No aphorisms, no clever inversions.
- Never write copy that implies a fixed inventory ("nine projects", "six roles"); more will be added.
- Positioning is **robotics / autonomy / perception**, not industrial automation. The Tesla and Rivian work is evidence, not the identity. A four-tile "impact numbers" block (±0.2 mm, 30+ robots, 48% faster, 4 years) was cut for reading as purely industrial.
- Fun belongs in the **interaction** (DETECT mode, the scan, hover states), never in the prose.

## User design preferences (from live feedback)

- Hero/home screen must stay clean: no stat counters, no "currently @ …" badges — just intro, CTAs, and scroll cue. A "Now / Next" section was also rejected — keep the section list lean.
- **Chrome/UI accent stays monochrome ink** (`--color-accent` = text color); page color comes from the three domain colors (Perception = crimson, Robotics = amber, Robotics AI = violet). An earlier "no blue, no green anywhere" reading was **overruled by the user** — other colors are allowed where they're doing real work (e.g. the hero's semantic detection palette).
- **Full-width layout, no centered max-width column** — sections span the viewport with just `px-5 sm:px-10` padding. Don't reintroduce `max-w-*` containers.
- Timeline logos should be large (16×16 nodes), not small chips.
- **No em dashes anywhere** (copy, comments, docs). The user asked for them to be removed from the whole codebase. Use a colon, comma, or full stop instead. A `grep -rn "—" src/ index.html` should come back empty.
- The site is aiming explicitly at **awwwards-calibre** work (oversized editorial type, generated visuals, scroll choreography, "spatial silence"), not at a conventional dev portfolio.

## Styling

Design tokens (colors, fonts) live in `src/index.css` as CSS custom properties, mapped into Tailwind via `@theme inline`. Dark mode toggles the `.dark` class on `<html>`; `@custom-variant dark` wires it to Tailwind's `dark:` prefix.

Type roles: `--font-display` = Space Grotesk (the user chose it; earlier the site ran Archivo, and Saira before that) for the name and section titles via `font-display`; `--font-sans` = Inter for body; `--font-mono` = JetBrains Mono for labels/metadata. Section headers use the shared `SectionHeader` (+ `RegMark` "+" registration cross) from `Section.tsx`, the calibration-mark motif that also frames the hero corners.

### Heading reveals (`Words`)

`Words` splits a heading into per-word spans, each inside an `overflow-hidden` wrapper, and rides them up. Two things about it are load-bearing and were both bugs first:

- The observer sits on the **heading**, driving the words through **variants**. Putting `whileInView` on each word does not fire: every word starts fully clipped out of its own wrapper, so it never intersects.
- The space between words is a **real text node between the wrappers**, not a space inside them. Trailing whitespace in an `inline-block` collapses (you get `Let'sbuildsomethingthatsees.`) and without it the heading has no break opportunity and cannot wrap.

## The hero visual (`FlowField.tsx`)

The hero's right-hand panel is a **generated optical-flow field**, the visualization the user's motion-perception work at Rivian (RAFT / MemFlowNet, labelled `RAFT / MemFlow`) actually output. A smooth procedural field drifts on its own; particles are advected through it as fading streaks; and **feature tracks** (keypoints with trails and a cross marker) are carried through it, the structure-from-motion / SLAM read on the same field. Everything is **coloured by direction** (hue = flow angle, the Middlebury / RAFT convention). The cursor is a moving object that **injects flow** into nearby cells via the shared `stamp()` emitter (`INJECT`, decaying by `DECAY`): moving it literally generates the optical flow the field estimates. Rendered on a permanently dark panel (`#090a0c`) so the flow colours read in both themes, with `lighter` compositing over a per-frame fade for the glowing-streak look. No image asset; the field is evaluated every frame.

This is the **original** FlowField look (vector grid + advected particle streaks + feature tracks, vivid full-saturation colour). Two later iterations were reverted: muting the palette to a held-back saturation, and then replacing the vector grid with a dense-underlay-plus-streamlines version, were both rejected ("the first one was best this one is tooo bad"). Do not remove the vector grid or mute the palette again without asking. The on-panel colour-wheel legend and the pulsing red status dot were separately cut for looking bad, so the HUD is plain mono labels only; don't reintroduce them.

A **tracked-objects** variant (drifting boxes with velocity vectors and speed readouts, each injecting its own flow) was built and rejected. The `stamp()` helper is the remnant: it supports multiple emitters, but only the cursor uses it now. Don't re-add moving boxes without asking.

This is the **fourth** hero visual, and the history is the important part, because the user has rejected every prior idea:

- **v1: the name as a point cloud** ("looks bad for the hero name effect"). Don't sample the letterforms.
- **v2: a procedural LiDAR road scene** ("lidar one makes no sense"). Deleted, along with a capabilities marquee ("useless").
- **v3: a camera frame reconstructed as a point cloud**, shown as an RGB-to-3D split reveal ("the depth reconstruction is what?? makes no sense", then "the monocular depth thing is okaish... think something cooler"). Deleted with `PointCloud.tsx`.
- **v4 (current): the optical-flow field.** Generative and probeable like the ideas the user liked, but tied to a real line on the resume and visually unlike anything rejected. If this is iterated, keep it honest to the perception work: flow, feature tracks, SLAM, not decoration.

Layout follows Awwwards' own 2026 read: type-first, editorial asymmetry, one cinematic framed visual, one primary CTA. Name at `text-5xl`/`7xl` (it must **fit**; oversized full-bleed wordmarks were rejected twice), statement, tagline, CTAs on the left; the framed panel on the right. The framed panel always needs a caption saying what it is: an uncaptioned "depth reconstruction" label was explicitly called meaningless.

This is the third attempt at the hero, and the history matters:

- **v1: the name as the point cloud.** Sampled `PRASHAM SONI` in Archivo and resolved the letterforms out of noise. User: the effect is good but "it looks bad for the hero name effect". **Don't point the cloud at the letterforms.**
- **v2: a procedural LiDAR road scene** (ground rings, vehicles, poles, gantry) plus a full-bleed bottom wordmark. User: "lidar one makes no sense", the name "even though it is big does not fit", the whole thing "looks bad". **Deleted.** A capabilities marquee added at the same time was called "useless" and is also gone.
- **v3 (current): the frame, reconstructed.** The user liked "the idea" (resolve out of noise, probeable, generated) but not the LiDAR subject. Sampling a real camera frame keeps the idea and gives it a reason to exist: it is the same pipeline the site is about (image → 3D), and it pairs with the detection overlay in About (image → detections).

Layout follows Awwwards' own 2026 read: type-first, editorial asymmetry, one cinematic framed visual, one primary CTA. Name at `text-5xl`/`7xl` (it must **fit**; oversized full-bleed wordmarks were rejected twice), statement, tagline, CTAs on the left; the framed panel on the right.

Stock photography as a **background wash** behind hero copy is still out. The frame is a framed, chromed panel, not wallpaper.

## DETECT mode (`DetectOverlay.tsx`)

The site claims a model can find things in a frame, so the toggle in the nav runs that claim **on the site itself**: the page becomes the input image, and every element carrying `data-detect="label"` (plus an optional `data-family` from `classColor` in `perception.ts`) comes back as a real bounding box with a confidence chip. Rects are read live on a rAF loop, so the boxes track scrolling. Confidences are a stable hash of the label, because a number that changed every frame would read as decoration rather than a detector.

This is the answer to the user's note that the detection idea "looks like a section rather than an interactive element integrated in the webpage". Add `data-detect` to anything new worth reporting.

Details that matter: boxes only **lock** (2px corner ticks, solid chip) once the opening sweep has passed their x, so the pass reads as a scan rather than a pop; label chips flip inside the box near the top of the viewport so they are never clipped; the readout lists the class legend for whatever is currently in frame; and **D** toggles the mode, **Esc** always leaves it.

### Verifying the annotation boxes

The `detections` in `perception.ts` are hand-placed image-% coords and are wrong more often than not on the first pass ("some object detection is bad"). Do not eyeball them. Render them back onto the source: composite an SVG of the rects over `public/perception/<name>-960.webp` with sharp, write a PNG, and actually look at it. That is how the night-street car boxes and three robot-cell boxes were caught sitting off their objects.

## The perception photos (`PerceptionScene`)

`PerceptionScene.tsx` is a framed camera feed with a live detector on it, with camera HUD chrome (a calm static "live" dot, timecode, viewfinder ticks, object/lock counts; the pulsing red REC dot was cut for looking bad). It takes an `aspect` prop and **lives inside About** as "fig. 01" (4:3, sticky in the right column), next to the paragraph claiming I can build one. It is no longer a full-bleed band of its own: see the note above about why `FieldFeed` was removed.

Six cinematic **Unsplash** photos (credits + source URLs in `public/perception/CREDITS.md`) auto-cycle every 9s — no manual selector, by user request. Themes: night urban driving, signalised intersection, aerial/BEV traffic, HD-map interchange, industrial robot cell, UAV. Image constraints (user-set): **landscape aspect, no identifiable faces**, and inside those themes. Off-theme "random" images (cat, dog, tram, excavator) were rejected. Avoid AI-generated/3D-render stock — it reads as fake on a robotics portfolio.

Interaction: boxes fade in with a small stagger when a new frame loads (the sweeping scan line between frames was removed for looking bad). With no pointer, the detector **walks its own hits**, which makes the idea legible on touch and demos itself before anyone hovers. On mouse move the cursor drives it, and with nothing under the cursor it locks the **nearest** box so it never goes dead. Boxes are hairline when idle, 2px + corner ticks + label chip when locked; chips carry depth readouts (`car 0.97 · 8m`). Detection colours are semantic (`classColor` in `perception.ts`: vehicle/vru/signal/structure/asset) — deliberately *not* the site's domain palette; the user confirmed the no-blue/no-green rule does not apply here.

Geometry: annotations are hand-placed image-% coords in `src/data/perception.ts`. Each image has a **`focus` point** driving `object-position`, and `coverPoint`/`coverBox` map boxes through that crop, clamp them to the frame, and **drop anything under 40% visible**, so no box ever floats over an object the viewer can't see.

### Changing the images

Drop a full-res source into `scripts/perception-src/`, run `npm run build:perception` (sharp → WebP at 960/1440/1920/2560 + an inline `lqip` placeholder), then add the entry to `perceptionImages`. **Verify every box** by rendering it back onto the source — hand-placed coords are wrong more often than not on the first pass.

History (all user-rejected, don't revisit): random Art Institute artwork washes, hand-drawn SVG wireframe scenes ("looks unpolished"), free-floating boxes over random backgrounds, a right-column framed image, dot navigation, and hover-only reveal (invisible on touch, and most desktop visitors never discovered it). The original Wikimedia photo set was replaced for being low-res (1280px) and visually flat.

## Commands

- `npm run dev` — dev server
- `npm run build` — typecheck (`tsc -b`) + production build
- `npm run preview` — preview the production build

## Content sources

The old Google Sites portfolio (<https://sites.google.com/view/prashamsoni/home>, subpages: /projects, /experience, /blogs, plus per-project pages) is the canonical source for older content — it supplied the Rivian Controls Integration Lead role, ICUBE toll metrics (22%/40%), Swarm Robots ROBOFEST context, and personal interests. Its project subpages host images (Swarm Robots, Flipkart arena/robots, fiducial markers) that could be saved into `public/projects/`. LinkedIn cannot be fetched programmatically (HTTP 999).

## Known gaps

- Swarm Robots now has media (`public/projects/swarm-robots/hero.png`, user-supplied). Flipkart Grid (warehouse) still has no local image. (The Fiducial Markers project was removed at the user's request.)
- `memflow` project: the AGV motion-perception work (MemFlowNet dual-camera, MOVING/STATIONARY, annotated flow video). Source lives at `Desktop/Ayna_raft_AWS/ayna-memflow`; card image is an annotated output frame (`output_bkup/back_annotated/back_00000.png`, chosen because it shows a tugger + its flow blob with no identifiable face). Domains: Perception + Robotics AI.
- ~~Flipkart Grid robot count~~ — resolved: the old site's dedicated project page confirms **3 AMRs**; data updated accordingly.
- Tesla internship ended **May 2026** (user corrected; not "Present").
- No deploy configured yet; git is initialized locally with no commits.
