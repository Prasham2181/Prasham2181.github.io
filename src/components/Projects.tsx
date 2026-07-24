import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, ExternalLink, X } from 'lucide-react'
import { projects, domainFilters, domainColor, type Domain, type Project } from '../data/projects'
import { Section } from './Section'
import { Rise } from './motion'

const EASE = [0.16, 1, 0.3, 1] as const

function DomainTags({ project, className = '' }: { project: Project; className?: string }) {
  return (
    <span className={`flex flex-wrap gap-x-3 gap-y-1 ${className}`}>
      {project.domains.map((domain) => (
        <span
          key={domain}
          style={{ color: domainColor[domain] }}
          className="font-mono text-[10px] font-medium tracking-widest whitespace-nowrap uppercase"
        >
          {domain}
        </span>
      ))}
    </span>
  )
}

function Media({ project, className = '', cover = true }: { project: Project; className?: string; cover?: boolean }) {
  return (
    <div className={`relative overflow-hidden bg-black ${className}`}>
      {project.image ? (
        <img
          src={project.image}
          alt={project.imageAlt}
          loading="lazy"
          className={`absolute inset-0 h-full w-full ${cover ? 'object-cover' : 'object-contain'}`}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-(--color-text)/8 to-(--color-text)/20">
          <span className="font-mono text-[10px] tracking-widest text-(--color-text-muted) uppercase">
            No preview
          </span>
        </div>
      )}
    </div>
  )
}

/** The sticky preview panel, desktop only: shows whichever row is active. */
function Preview({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <div className="sticky top-24">
      <button type="button" onClick={onOpen} className="group block w-full text-left">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-(--color-border)">
          <AnimatePresence mode="wait">
            <motion.div
              key={project.slug}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="absolute inset-0"
            >
              <Media project={project} className="h-full w-full transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]" />
            </motion.div>
          </AnimatePresence>
          <span className="absolute right-4 bottom-4 flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 font-mono text-[10px] tracking-widest text-black uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            Open case study <ArrowUpRight size={13} />
          </span>
        </div>
      </button>

      <div className="mt-5">
        <p className="font-mono text-[11px] text-(--color-text-muted)">{project.context}</p>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-pretty text-(--color-text-muted)">
          {project.summary}
        </p>
        <p className="mt-4 font-mono text-[11px] tracking-wide text-(--color-text-muted)">
          {project.tech.slice(0, 5).join('  ·  ')}
        </p>
      </div>
    </div>
  )
}

/** One row in the index. */
function Row({
  project,
  n,
  active,
  onHover,
  onOpen,
}: {
  project: Project
  n: number
  active: boolean
  onHover: () => void
  onOpen: () => void
}) {
  return (
    <button
      type="button"
      onMouseEnter={onHover}
      onFocus={onHover}
      onClick={onOpen}
      data-detect={`project.${project.slug}`}
      data-family={n % 2 === 0 ? 'vehicle' : 'asset'}
      className="group grid w-full grid-cols-[2rem_1fr_auto] items-baseline gap-4 border-t border-(--color-border) py-6 text-left last:border-b sm:gap-6 sm:py-7"
    >
      <span
        className={`font-mono text-xs tabular-nums transition-colors ${
          active ? 'text-(--color-text)' : 'text-(--color-text-muted)'
        }`}
      >
        {String(n + 1).padStart(2, '0')}
      </span>

      <span className="min-w-0">
        <span className="block font-display text-xl leading-tight font-semibold tracking-tight text-balance text-(--color-text) transition-transform duration-300 group-hover:translate-x-1 sm:text-2xl">
          {project.title}
        </span>
        <DomainTags project={project} className="mt-2" />
        <span className="mt-2 block max-w-md text-sm leading-relaxed text-pretty text-(--color-text-muted) lg:hidden">
          {project.summary}
        </span>
      </span>

      <span className="hidden shrink-0 items-center gap-3 font-mono text-[11px] text-(--color-text-muted) sm:flex">
        <span className="tabular-nums">{project.dates.split('–').pop()?.trim()}</span>
        <ArrowUpRight
          size={16}
          className={`transition-[opacity,transform] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
            active ? 'opacity-100 text-(--color-text)' : 'opacity-40'
          }`}
        />
      </span>

      <Media project={project} className="col-span-3 mt-4 aspect-[16/10] w-full rounded-lg lg:hidden" />
    </button>
  )
}

function Field({ label, body }: { label: string; body: string }) {
  return (
    <div className="border-t border-(--color-border) py-6 first:border-t-0 first:pt-0">
      <p className="font-mono text-[11px] tracking-widest text-(--color-perception) uppercase">
        {label}
      </p>
      <p className="mt-2.5 text-[0.95rem] leading-relaxed text-pretty text-(--color-text)">{body}</p>
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
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/75 p-3 backdrop-blur-md sm:p-6"
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
            <Media project={project} cover={false} className="aspect-[16/10] w-full shrink-0" />

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

          {/* right: the case study */}
          <div className="p-6 sm:p-8 lg:max-h-[85vh] lg:overflow-y-auto">
            <p className="mb-6 font-mono text-[11px] tracking-widest text-(--color-text-muted) uppercase">
              Case study
            </p>
            <Field label="Problem" body={project.problem} />
            <Field label="Approach" body={project.approach} />
            <Field label="Result" body={project.result} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function Projects() {
  const [filter, setFilter] = useState<Domain | 'All'>('All')
  const [active, setActive] = useState(0)
  const [selected, setSelected] = useState<Project | null>(null)
  const visible = filter === 'All' ? projects : projects.filter((p) => p.domains.includes(filter))
  const preview = visible[Math.min(active, visible.length - 1)] ?? visible[0]

  const pick = (f: Domain | 'All') => {
    setFilter(f)
    setActive(0)
  }

  return (
    <Section
      id="projects"
      index="03"
      eyebrow="Work"
      title="Projects & research"
      lede="Reconstruction, learned perception, state estimation and multi-robot systems. Hover a title to preview it, select it to open the full case study."
    >
      <Rise>
        <div className="-mt-6 mb-10 flex flex-wrap items-center gap-2">
          {(['All', ...domainFilters] as const).map((f) => {
            const on = filter === f
            return (
              <button
                key={f}
                type="button"
                onClick={() => pick(f)}
                style={on && f !== 'All' ? { backgroundColor: domainColor[f] } : undefined}
                className={`rounded-full px-4 py-2 font-mono text-[11px] tracking-widest uppercase transition-[color,background-color,border-color,scale] duration-200 active:scale-[0.96] ${
                  on
                    ? f === 'All'
                      ? 'bg-(--color-text) text-(--color-bg)'
                      : 'text-white'
                    : 'border border-(--color-border) text-(--color-text-muted) hover:border-(--color-text) hover:text-(--color-text)'
                }`}
              >
                {f}
              </button>
            )
          })}
        </div>
      </Rise>

      <div className="grid gap-x-16 lg:grid-cols-[1.1fr_0.9fr]">
        <ol>
          {visible.map((project, i) => (
            <li key={project.slug}>
              <Row
                project={project}
                n={i}
                active={preview?.slug === project.slug}
                onHover={() => setActive(i)}
                onOpen={() => setSelected(project)}
              />
            </li>
          ))}
        </ol>

        <div className="hidden lg:block">
          {preview && <Preview project={preview} onOpen={() => setSelected(preview)} />}
        </div>
      </div>

      <AnimatePresence>
        {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </Section>
  )
}
