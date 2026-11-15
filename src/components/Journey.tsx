import { useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion'
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
    // company alone is not unique (two Tesla roles), so key on the role too
    key: `${job.company}|${job.role}`,
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
    key: `${ed.school}|${ed.degree}`,
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

/* ---- the route -------------------------------------------------------- */

const ROUTE_W = 64 // px, width of the trail column
const X = [18, 46] // the trail swings between these two x positions
const NODE_Y = 27 // px from the top of a row to its waypoint

/** The trail runs top to bottom, most recent first. Each row draws its own leg. */
function legPath(i: number, last: boolean, h: number): string {
  const x = X[i % 2]
  const nx = X[(i + 1) % 2]
  if (last) return `M${x} 0 L${x} ${NODE_Y}`
  const d = Math.max(24, (h - NODE_Y) * 0.55)
  return `M${x} 0 L${x} ${NODE_Y} C${x} ${NODE_Y + d} ${nx} ${h - d} ${nx} ${h}`
}

function RouteRow({ item, index, last }: { item: TimelineItem; index: number; last: boolean }) {
  const rowRef = useRef<HTMLLIElement>(null)
  const [h, setH] = useState(220)
  const [open, setOpen] = useState(index === 0)
  const hasBullets = (item.bullets?.length ?? 0) > 0
  const x = X[index % 2]

  // the leg is drawn in pixels, so re-measure when the row grows (details open)
  useLayoutEffect(() => {
    const el = rowRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setH(Math.round(el.getBoundingClientRect().height)))
    ro.observe(el)
    setH(Math.round(el.getBoundingClientRect().height))
    return () => ro.disconnect()
  }, [])

  // each leg fills crimson as the row scrolls through the middle of the screen
  const { scrollYProgress } = useScroll({ target: rowRef, offset: ['start 72%', 'end 45%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 })
  const dot = useTransform(scrollYProgress, [0, 0.08], [0, 1])

  const d = legPath(index, last, h)
  const edu = item.kind === 'education'

  return (
    <li ref={rowRef} className="relative grid grid-cols-[4rem_minmax(0,1fr)] gap-x-4 pb-10 last:pb-4">
      <div className="relative" style={{ width: ROUTE_W }} aria-hidden="true">
        <svg width={ROUTE_W} height={h} viewBox={`0 0 ${ROUTE_W} ${h}`} className="absolute inset-0 overflow-visible">
          <path d={d} fill="none" stroke="var(--color-text-muted)" strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="2 6" strokeLinecap="round" />
          <motion.path d={d} fill="none" stroke="var(--color-brand)" strokeWidth="2.5" strokeLinecap="round" style={{ pathLength: fill }} />
        </svg>
        <span
          className={`absolute grid h-3.5 w-3.5 place-items-center border-2 border-(--color-text-muted)/60 bg-(--color-bg) ${edu ? 'rotate-45 rounded-[3px]' : 'rounded-full'}`}
          style={{ left: x - 7, top: NODE_Y - 7 }}
        >
          <motion.span style={{ opacity: dot, scale: dot }} className={`h-2 w-2 bg-(--color-brand) ${edu ? 'rounded-[1px]' : 'rounded-full'}`} />
        </span>
      </div>

      <motion.div
        className="min-w-0"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-start gap-4">
          <LogoPlate item={item} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-x-4 gap-y-0.5 sm:flex-row sm:items-baseline sm:justify-between">
              <h3 className="text-base leading-snug font-semibold text-(--color-text) sm:text-lg">{item.title}</h3>
              <span className="shrink-0 font-mono text-[12px] text-(--color-text-muted) tabular-nums">{item.dates}</span>
            </div>
            <p className="mt-0.5 text-sm text-(--color-text-muted)">
              <span className="font-medium text-(--color-text)">{item.subtitle}</span> · {item.location}
              {item.gpa && <span className="ml-2 font-mono text-xs">GPA {item.gpa}</span>}
            </p>
          </div>
        </div>

        {item.headline && (
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-pretty text-(--color-text-muted)">{item.headline}</p>
        )}

        {(item.stats || item.stack) && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.stats?.map((stat) => (
              <span key={stat} className="rounded-md bg-(--color-accent-soft) px-2 py-1 font-mono text-[11px] text-(--color-text) tabular-nums">
                {stat}
              </span>
            ))}
            {item.stack?.map((tool) => (
              <span key={tool} className="rounded-md border border-(--color-border) px-2 py-1 font-mono text-[11px] text-(--color-text-muted)">
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
                    <li key={i} className="relative pl-4 text-sm leading-relaxed text-pretty text-(--color-text-muted) first:mt-3">
                      <span aria-hidden="true" className="absolute top-[0.6rem] left-0 h-1 w-1 rounded-full bg-(--color-text-muted)" />
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
  return (
    <Section
      id="journey"
      eyebrow="Experience"
      title="Work and education"
      lede="Robotics and computer vision roles across autonomous systems, industrial robotics and R&D, alongside an M.S. in Robotics Engineering."
    >
      <p className="mb-6 flex items-center gap-2 font-mono text-[11px] tracking-wider text-(--color-text-muted) uppercase">
        <svg width="10" height="9" viewBox="0 0 10 9" fill="currentColor" aria-hidden="true" className="text-(--color-brand)">
          <path d="M5 0 10 9H0z" />
        </svg>
        The route so far, most recent first
        <span className="ml-1 inline-flex items-center gap-1.5 normal-case">
          <span className="h-2 w-2 rounded-full border border-(--color-text-muted)/70" /> work
          <span className="ml-1.5 h-2 w-2 rotate-45 rounded-[2px] border border-(--color-text-muted)/70" /> education
        </span>
      </p>
      <ol className="max-w-4xl">
        {items.map((item, i) => (
          <RouteRow key={item.key} item={item} index={i} last={i === items.length - 1} />
        ))}
      </ol>
    </Section>
  )
}
