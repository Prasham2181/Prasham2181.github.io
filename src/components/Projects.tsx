import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, ExternalLink, X } from 'lucide-react'
import { projects, domainFilters, domainColor, type Domain, type Project } from '../data/projects'
import { Section } from './Section'

const EASE = [0.16, 1, 0.3, 1] as const

const domainSoft: Record<Domain, string> = {
  Perception: 'var(--color-perception-soft)',
  Robotics: 'var(--color-robotics-soft)',
  'Robotics AI': 'var(--color-robotics-ai-soft)',
  Controls: 'var(--color-controls-soft)',
}

function DomainTags({ project, className = '' }: { project: Project; className?: string }) {
  return (
    <span className={`flex flex-wrap gap-1.5 ${className}`}>
      {project.domains.map((domain) => (
        <span
          key={domain}
          style={{ color: domainColor[domain], backgroundColor: domainSoft[domain] }}
          className="rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap"
        >
          {domain}
        </span>
      ))}
    </span>
  )
}

function MediaView({
  src,
  alt,
  fit = 'cover',
  className = '',
}: {
  src: string
  alt: string
  fit?: 'cover' | 'contain'
  className?: string
}) {
  const isVideo = /\.(mp4|webm)$/i.test(src)
  // figures (plots, diagrams) are never cropped and sit on white; photos fill the frame
  const frame = fit === 'contain' ? 'bg-white' : 'bg-neutral-900'
  const cls = `absolute inset-0 h-full w-full ${fit === 'contain' ? 'object-contain p-2' : 'object-cover'}`
  return (
    <div className={`relative overflow-hidden ${frame} ${className}`}>
      {src ? (
        isVideo ? (
          <video src={src} autoPlay loop muted playsInline preload="metadata" aria-label={alt} className={cls} />
        ) : (
          <img src={src} alt={alt} loading="lazy" decoding="async" className={cls} />
        )
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-(--color-accent-soft)">
          <span className="font-mono text-[10px] tracking-widest text-(--color-text-muted) uppercase">
            No preview
          </span>
        </div>
      )}
    </div>
  )
}

/** One project card: media on top, then tags, title, summary, stack. */
function Card({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-(--color-border) bg-(--color-bg-raised) text-left transition-[border-color,scale] duration-150 hover:border-(--color-text-muted) active:scale-[0.99]"
    >
      <MediaView
        src={project.image}
        alt={project.imageAlt}
        fit={project.fit}
        className="aspect-[16/10] w-full border-b border-(--color-border) [&_img]:transition-transform [&_img]:duration-500 group-hover:[&_img]:scale-[1.03]"
      />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <DomainTags project={project} />
          <span className="shrink-0 font-mono text-[11px] text-(--color-text-muted) tabular-nums">
            {project.dates.split('–').pop()?.trim()}
          </span>
        </div>
        <h3 className="mt-3 flex items-start justify-between gap-3 text-lg leading-snug font-semibold tracking-tight text-(--color-text)">
          {project.title}
          <ArrowUpRight
            size={16}
            className="mt-1 shrink-0 text-(--color-text-muted) transition-[color,translate] duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-(--color-brand)"
          />
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-pretty text-(--color-text-muted)">{project.summary}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
          {project.tech.slice(0, 4).map((t) => (
            <span
              key={t}
              className="rounded-md bg-(--color-accent-soft) px-2 py-1 font-mono text-[10px] text-(--color-text-muted)"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </button>
  )
}

function Field({ label, body }: { label: string; body: string }) {
  return (
    <motion.div
      variants={{ hide: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.5, ease: EASE }}
      className="border-t border-(--color-border) py-6 first:border-t-0 first:pt-0"
    >
      <p className="font-mono text-[11px] tracking-widest text-(--color-brand) uppercase">
        {label}
      </p>
      <p className="mt-2.5 text-[0.95rem] leading-relaxed text-pretty text-(--color-text)">{body}</p>
    </motion.div>
  )
}

/** The case-study media: the lead image plus any gallery items, with a thumbnail strip. */
function Gallery({ project }: { project: Project }) {
  const items = [
    { src: project.image, caption: project.imageAlt, fit: project.fit },
    ...(project.gallery ?? []).map((g) => ({ ...g, fit: g.fit })),
  ].filter((i) => i.src)
  const [index, setIndex] = useState(0)
  const current = items[index] ?? items[0]
  if (!current) return null

  return (
    <div className="shrink-0">
      <MediaView
        key={current.src}
        src={current.src}
        alt={current.caption}
        fit={current.fit ?? 'contain'}
        className="aspect-[16/10] w-full"
      />
      <p className="px-6 pt-3 text-[12px] leading-snug text-(--color-text-muted) sm:px-8">{current.caption}</p>
      {items.length > 1 && (
        <div className="flex gap-2 overflow-x-auto px-6 pt-3 sm:px-8">
          {items.map((item, i) => (
            <button
              key={item.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show media ${i + 1}: ${item.caption}`}
              aria-pressed={i === index}
              className={`relative h-12 w-[4.5rem] shrink-0 overflow-hidden rounded-md border transition-[border-color,opacity] duration-150 ${
                i === index
                  ? 'border-(--color-text) opacity-100'
                  : 'border-(--color-border) opacity-60 hover:opacity-100'
              }`}
            >
              <MediaView src={item.src} alt="" fit={item.fit ?? 'cover'} className="h-full w-full" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/60 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.32, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
        className="relative my-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-bg) shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-black/40 text-white/90 backdrop-blur-sm transition-colors hover:bg-black/70"
        >
          <X size={17} />
        </button>

        <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
          {/* left: the artifact and the facts */}
          <div className="flex flex-col border-b border-(--color-border) lg:border-r lg:border-b-0">
            <Gallery project={project} />

            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <DomainTags project={project} />
              <h3 className="mt-3 font-display text-2xl leading-tight font-bold tracking-tight text-balance text-(--color-text) sm:text-3xl">
                {project.title}
              </h3>
              <p className="mt-2 font-mono text-xs text-(--color-text-muted)">
                {project.context}
                {project.dates ? ` · ${project.dates}` : ''}
              </p>

              {project.metrics && (
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {project.metrics.map((m) => (
                    <span
                      key={m}
                      className="rounded-md bg-(--color-accent-soft) px-2.5 py-1.5 font-mono text-[11px] text-(--color-text) tabular-nums"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-auto pt-6">
                <p className="mb-2 font-mono text-[10px] tracking-widest text-(--color-text-muted) uppercase">
                  Stack
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-(--color-border) px-2 py-1 font-mono text-[11px] text-(--color-text-muted)"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {project.links.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-3">
                    {project.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-(--color-border) px-5 py-2.5 text-sm text-(--color-text) transition-[border-color,scale] duration-200 hover:border-(--color-text) active:scale-[0.96]"
                      >
                        <ExternalLink size={14} /> {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* right: the case study, fields rising in sequence as the modal settles */}
          <motion.div
            initial="hide"
            animate="show"
            variants={{ show: { transition: { delayChildren: 0.18, staggerChildren: 0.09 } } }}
            className="p-6 sm:p-8 lg:max-h-[85vh] lg:overflow-y-auto"
          >
            <motion.p
              variants={{ hide: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.5, ease: EASE }}
              className="mb-6 font-mono text-[11px] tracking-widest text-(--color-text-muted) uppercase"
            >
              Case study
            </motion.p>
            <Field label="Problem" body={project.problem} />
            <Field label="Approach" body={project.approach} />
            <Field label="Result" body={project.result} />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function Projects() {
  const [filter, setFilter] = useState<Domain | 'All'>('All')
  const [selected, setSelected] = useState<Project | null>(null)
  const visible = filter === 'All' ? projects : projects.filter((p) => p.domains.includes(filter))

  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title="Projects & Research"
      lede="Reconstruction, learned perception, state estimation and multi-robot systems. Select a project to read the case study."
    >
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {(['All', ...domainFilters] as const).map((f) => {
          const on = filter === f
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={on}
              className={`rounded-full border px-3.5 py-1.5 text-[13px] transition-colors duration-150 active:scale-[0.96] ${
                on
                  ? 'border-(--color-text) bg-(--color-text) text-(--color-bg)'
                  : 'border-(--color-border) text-(--color-text-muted) hover:border-(--color-text-muted) hover:text-(--color-text)'
              }`}
            >
              {f}
            </button>
          )
        })}
      </div>

      <ul className="grid gap-4 md:grid-cols-2">
        {visible.map((project) => (
          <li key={project.slug}>
            <Card project={project} onOpen={() => setSelected(project)} />
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </Section>
  )
}
