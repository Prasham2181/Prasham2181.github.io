import { useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useScroll, useSpring } from 'framer-motion'
import { ChevronDown, GraduationCap } from 'lucide-react'
import { Section } from './Section'
import { experience } from '../data/experience'
import { education } from '../data/profile'

type TimelineItem = {
  key: string
  kind: 'work' | 'education'
  title: string
  subtitle: string
  location: string
  dates: string
  logo?: string
  logoScale?: number
  headline?: string
  stats?: string[]
  stack?: string[]
  bullets?: string[]
  gpa?: string
}

const MONTHS: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
}

/** Sort key from the first "Mon YYYY" in a dates string. */
function startStamp(dates: string): number {
  const m = dates.match(/([A-Z][a-z]{2})\s+(\d{4})/)
  if (!m) return 0
  return Number(m[2]) * 12 + (MONTHS[m[1]] ?? 0)
}

const items: TimelineItem[] = [
  ...experience.map((job): TimelineItem => ({
    key: job.company,
    kind: 'work',
    title: job.role,
    subtitle: job.company,
    location: job.location,
    dates: job.dates,
    logo: job.logo,
    logoScale: job.logoScale,
    headline: job.headline,
    stats: job.stats,
    stack: job.stack,
    bullets: job.bullets,
  })),
  ...education.map((ed): TimelineItem => ({
    key: ed.school,
    kind: 'education',
    title: ed.degree,
    subtitle: ed.school,
    location: ed.location,
    dates: ed.dates,
    logo: ed.logo,
    logoScale: ed.logoScale,
    headline: ed.note,
    gpa: ed.gpa,
  })),
].sort((a, b) => startStamp(b.dates) - startStamp(a.dates))

/**
 * Company marks are dark-on-transparent artwork at unrelated aspect ratios, so
 * each sits on a permanent white plate (dark marks survive dark mode) and is
 * scaled per logo (`logoScale`) to carry the same optical weight.
 */
function LogoPlate({ item }: { item: TimelineItem }) {
  return (
    <span className="grid h-12 w-[4.5rem] shrink-0 place-items-center overflow-hidden rounded-lg border border-(--color-border) bg-white px-2">
      {item.logo ? (
        <img
          src={item.logo}
          alt=""
          loading="lazy"
          style={{ transform: `scale(${item.logoScale ?? 1})` }}
          className="max-h-8 max-w-full object-contain"
        />
      ) : (
        <GraduationCap size={22} className="text-(--color-text-muted)" strokeWidth={1.5} />
      )}
    </span>
  )
}

function TimelineEntry({ item, first }: { item: TimelineItem; first: boolean }) {
  const ref = useRef<HTMLLIElement>(null)
  // lit once the entry crosses the middle of the viewport, in step with the rail fill
  const passed = useInView(ref, { once: true, margin: '0px 0px -45% 0px' })
  const [open, setOpen] = useState(first)
  const hasBullets = (item.bullets?.length ?? 0) > 0

  return (
    <li ref={ref} className="relative pb-10 pl-10 last:pb-0">
      <motion.span
        aria-hidden="true"
        className="absolute top-4 left-[6px] h-[11px] w-[11px] rounded-full border-2"
        initial={false}
        animate={{
          scale: passed ? 1 : 0.6,
          backgroundColor: passed ? 'var(--color-text)' : 'var(--color-bg)',
          borderColor: passed ? 'var(--color-text)' : 'var(--color-border)',
          boxShadow: passed ? '0 0 0 4px var(--color-accent-soft)' : '0 0 0 0 rgba(0,0,0,0)',
        }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      />
      <motion.div
        initial={{ opacity: 0, x: -14 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '0px 0px -15% 0px' }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-start gap-4">
          <LogoPlate item={item} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-x-4 gap-y-0.5 sm:flex-row sm:items-baseline sm:justify-between">
              <h3 className="text-base leading-snug font-semibold text-(--color-text) sm:text-lg">
                {item.title}
              </h3>
              <span className="shrink-0 font-mono text-[12px] text-(--color-text-muted) tabular-nums">
                {item.dates}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-(--color-text-muted)">
              <span className="font-medium text-(--color-text)">{item.subtitle}</span> · {item.location}
              {item.gpa && <span className="ml-2 font-mono text-xs">GPA {item.gpa}</span>}
            </p>
          </div>
        </div>

        {item.headline && (
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-pretty text-(--color-text-muted)">
            {item.headline}
          </p>
        )}

        {(item.stats || item.stack) && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.stats?.map((stat) => (
              <span
                key={stat}
                className="rounded-md bg-(--color-accent-soft) px-2 py-1 font-mono text-[11px] text-(--color-text) tabular-nums"
              >
                {stat}
              </span>
            ))}
            {item.stack?.map((tool) => (
              <span
                key={tool}
                className="rounded-md border border-(--color-border) px-2 py-1 font-mono text-[11px] text-(--color-text-muted)"
              >
                {tool}
              </span>
            ))}
          </div>
        )}

        {hasBullets && (
          <>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="mt-3 inline-flex items-center gap-1 text-[13px] text-(--color-text-muted) transition-colors hover:text-(--color-brand)"
            >
              {open ? 'Hide details' : 'Show details'}
              <ChevronDown size={14} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="max-w-3xl space-y-2 overflow-hidden"
                >
                  {item.bullets!.map((bullet, i) => (
                    <li
                      key={i}
                      className="relative pl-4 text-sm leading-relaxed text-pretty text-(--color-text-muted) first:mt-3"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute top-[0.6rem] left-0 h-1 w-1 rounded-full bg-(--color-text-muted)"
                      />
                      {bullet}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </>
        )}
      </motion.div>
    </li>
  )
}

export function Journey() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 60%', 'end 55%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 })

  return (
    <Section
      id="journey"
      eyebrow="Experience"
      title="Work and education"
      lede="Robotics and computer vision roles across autonomous systems, industrial robotics and R&D, alongside an M.S. in Robotics Engineering."
    >
      <div ref={ref} className="relative max-w-4xl">
        {/* the rail fills as the section is read */}
        <div aria-hidden="true" className="absolute top-4 bottom-3 left-[11px] w-px bg-(--color-border)">
          <motion.div
            style={{ scaleY: fill }}
            className="h-full w-full origin-top bg-gradient-to-b from-(--color-perception) via-(--color-robotics) to-(--color-robotics-ai)"
          />
        </div>
        <ol>
          {items.map((item, i) => (
            <TimelineEntry key={item.key} item={item} first={i === 0} />
          ))}
        </ol>
      </div>
    </Section>
  )
}
