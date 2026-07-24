import { useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { GraduationCap, Plus } from 'lucide-react'
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
 * The logo plate.
 *
 * Company marks are dark-on-transparent artwork at unrelated aspect ratios: a
 * square Tesla T next to a 4.8:1 Keepsake wordmark. They are mounted on a
 * permanent white plate (the only way dark marks survive dark mode), in a
 * landscape box wide enough for a wordmark, centred with object-contain, and
 * scaled per logo (`logoScale`) so they all carry the same optical weight.
 */
function LogoPlate({ item }: { item: TimelineItem }) {
  return (
    <span className="grid h-16 w-24 shrink-0 place-items-center overflow-hidden rounded-xl border border-(--color-border) bg-white px-3 transition-[border-color,box-shadow,transform] duration-300 group-hover:-translate-y-0.5 group-hover:border-(--color-text) group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)]">
      {item.logo ? (
        <img
          src={item.logo}
          alt=""
          style={{ transform: `scale(${item.logoScale ?? 1})` }}
          className="max-h-10 max-w-full object-contain"
        />
      ) : (
        <GraduationCap size={28} className="text-(--color-robotics-ai)" strokeWidth={1.5} />
      )}
    </span>
  )
}

function TimelineEntry({ item, index }: { item: TimelineItem; index: number }) {
  const [open, setOpen] = useState(index === 0)
  const expandable = (item.bullets?.length ?? 0) > 0
  const [from, to] = item.dates.split('–').map((s) => s.trim())

  return (
    <motion.li
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.25) }}
      className="group relative border-t border-(--color-border) last:border-b"
      data-detect={item.kind === 'work' ? 'experience.role' : 'experience.education'}
      data-family={item.kind === 'work' ? 'asset' : 'structure'}
    >
      <span
        aria-hidden="true"
        className={`absolute top-10 -left-[36px] hidden h-2 w-2 rounded-full border transition-colors duration-300 md:block ${
          open
            ? 'border-(--color-text) bg-(--color-text)'
            : 'border-(--color-border) bg-(--color-bg) group-hover:border-(--color-text)'
        }`}
      />

      <button
        type="button"
        onClick={() => expandable && setOpen((v) => !v)}
        disabled={!expandable}
        aria-expanded={expandable ? open : undefined}
        className={`grid w-full grid-cols-[1fr_auto] items-start gap-x-6 gap-y-4 py-8 text-left sm:grid-cols-[8.5rem_minmax(0,1fr)_auto] ${
          expandable ? 'cursor-pointer' : 'cursor-default'
        }`}
      >
        <span className="col-span-2 flex items-baseline gap-2 pt-1 font-mono text-xs tabular-nums sm:col-span-1 sm:flex-col sm:gap-1">
          <span className="text-(--color-text)">{from}</span>
          <span className="text-(--color-text-muted)">{to ?? ''}</span>
        </span>

        <span className="flex min-w-0 items-start gap-5">
          <LogoPlate item={item} />

          <span className="min-w-0 flex-1">
            <span className="block font-display text-xl leading-tight font-semibold tracking-tight text-(--color-text) [text-wrap:balance] sm:text-2xl">
              {item.title}
            </span>
            <span className="mt-1 block text-sm text-(--color-text-muted)">
              {item.subtitle} · {item.location}
              {item.gpa && <span className="ml-2 font-mono text-xs">GPA {item.gpa}</span>}
            </span>

            {item.headline && (
              <span className="mt-3.5 block max-w-2xl text-sm leading-relaxed text-pretty text-(--color-text)">
                {item.headline}
              </span>
            )}

            {(item.stats || item.stack) && (
              <span className="mt-4 flex flex-wrap items-center gap-1.5">
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
              </span>
            )}
          </span>
        </span>

        {expandable && (
          <motion.span
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-(--color-border) text-(--color-text-muted) transition-colors duration-300 group-hover:border-(--color-text) group-hover:text-(--color-text)"
            aria-hidden="true"
          >
            <Plus size={15} />
          </motion.span>
        )}
      </button>

      <AnimatePresence initial={false}>
        {expandable && open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            {/* aligned to the copy column: date column + gap + plate + gap */}
            <ul className="space-y-3.5 pb-9 sm:ml-[8.5rem] sm:pl-[7.25rem]">
              {item.bullets!.map((bullet, i) => (
                <li
                  key={i}
                  className="relative max-w-3xl pl-5 text-sm leading-relaxed text-pretty text-(--color-text-muted)"
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-[0.55rem] left-0 h-1 w-1 rounded-full bg-(--color-text-muted)"
                  />
                  {bullet}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  )
}

export function Journey() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 65%', 'end 65%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 })

  return (
    <Section
      id="journey"
      index="02"
      eyebrow="Experience"
      title="Career trajectory"
      lede="Robotics and computer vision roles across autonomous systems, industrial robotics and R&D, alongside an M.S. in Robotics Engineering. Select an entry to expand it."
    >
      <div ref={ref} className="relative md:pl-8">
        {/* the rail fills as the section is read */}
        <div
          aria-hidden="true"
          className="absolute top-0 bottom-0 left-0 hidden w-px bg-(--color-border) md:block"
        >
          <motion.div
            style={{ scaleY: fill }}
            className="h-full w-full origin-top bg-gradient-to-b from-(--color-perception) via-(--color-robotics) to-(--color-robotics-ai)"
          />
        </div>

        <ol>
          {items.map((item, i) => (
            <TimelineEntry key={item.key} item={item} index={i} />
          ))}
        </ol>
      </div>
    </Section>
  )
}
