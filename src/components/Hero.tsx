import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowRight, FileDown } from 'lucide-react'
import { profile } from '../data/profile'
import { FlowField } from './FlowField'
import { Magnetic, Scramble } from './motion'

const EASE = [0.16, 1, 0.3, 1] as const

/** A registration cross, one per corner of the frame. */
function Corner({ at, size = 11 }: { at: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 10 10"
      aria-hidden="true"
      className={`absolute text-(--color-text-muted) opacity-40 ${at}`}
    >
      <path d="M5 0v10M0 5h10" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

export function Hero() {
  const [count, setCount] = useState(0)
  const onCount = useCallback((n: number) => setCount(n), [])

  return (
    // the sticky nav is in flow, so a full svh here would push the CTAs off-screen
    <section
      id="top"
      className="relative flex min-h-[calc(100svh-58px)] w-full flex-col justify-between gap-12 px-5 py-6 sm:px-10 sm:py-8"
    >
      <Corner at="top-3 left-3 sm:top-5 sm:left-5" />
      <Corner at="top-3 right-3 sm:top-5 sm:right-5" />
      <Corner at="bottom-3 left-3 sm:bottom-5 sm:left-5" />
      <Corner at="bottom-3 right-3 sm:bottom-5 sm:right-5" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="flex items-start justify-between gap-6 font-mono text-[11px] tracking-widest uppercase sm:text-xs"
      >
        <Scramble text={profile.domains.join(' / ')} className="text-(--color-text)" />
        <p className="text-right text-(--color-text-muted)">
          {profile.location}
          <br />
          <span className="tabular-nums">{profile.coords}</span>
        </p>
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="-mt-8 h-px w-full origin-left bg-(--color-border)"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.4, delay: 0.1, ease: EASE }}
      />

      <div className="grid flex-1 items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
        >
          <h1 className="font-display text-5xl leading-[0.92] font-bold tracking-[-0.03em] text-(--color-text) sm:text-6xl xl:text-7xl">
            <span className="sr-only">{profile.name}, robotics and perception engineer.</span>
            {[profile.first, profile.last].map((line, i) => (
              <span key={line} aria-hidden="true" className="block overflow-hidden pb-[0.04em]">
                <motion.span
                  className="block"
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1, delay: 0.2 + i * 0.08, ease: EASE }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <p
            data-detect="hero.statement"
            data-family="signal"
            className="mt-8 max-w-lg font-display text-xl leading-[1.25] font-semibold text-balance text-(--color-text) sm:text-2xl"
          >
            {profile.punchline}
          </p>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-pretty text-(--color-text-muted)">
            {profile.tagline}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a
                href="#projects"
                data-detect="cta.primary"
                data-family="asset"
                className="inline-flex items-center gap-2 rounded-full bg-(--color-text) px-6 py-3 text-sm font-medium text-(--color-bg) transition-[opacity,scale] duration-200 hover:opacity-90 active:scale-[0.96]"
              >
                View projects <ArrowRight size={15} />
              </a>
            </Magnetic>
            <Magnetic strength={0.22}>
              <a
                href={profile.links.resume}
                download
                className="inline-flex items-center gap-2 rounded-full border border-(--color-border) px-6 py-3 text-sm font-medium text-(--color-text) transition-[border-color,scale] duration-200 hover:border-(--color-text) active:scale-[0.96]"
              >
                <FileDown size={15} /> Résumé
              </a>
            </Magnetic>
          </div>
        </motion.div>

        {/* An optical-flow field, generated: the visualization my motion-perception
            work produced. It drifts on its own, and moving the cursor induces flow
            around it, coloured by direction like a real flow estimate. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.25, ease: EASE }}
          className="hidden lg:block"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden border border-(--color-border)">
            <FlowField className="absolute inset-0" onVectors={onCount} />

            <Corner at="-top-[5px] -left-[5px]" size={10} />
            <Corner at="-top-[5px] -right-[5px]" size={10} />
            <Corner at="-bottom-[5px] -left-[5px]" size={10} />
            <Corner at="-bottom-[5px] -right-[5px]" size={10} />

            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-3.5 py-3 font-mono text-[10px] tracking-[0.2em] text-white/60 uppercase">
              <span>optical flow · RAFT / MemFlow</span>
              <span className="tabular-nums">{count.toLocaleString()} tracks</span>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between px-3.5 py-3 font-mono text-[10px] tracking-[0.2em] text-white/60 uppercase">
              <span>hue = flow direction</span>
              <span>move to induce motion</span>
            </div>
          </div>

          <p className="mt-3 flex items-start justify-between gap-6 font-mono text-[11px] leading-relaxed text-(--color-text-muted)">
            <span className="max-w-sm">
              A live optical-flow field: the same visualization my real-time motion-perception work
              produces. Move your cursor to induce flow.
            </span>
            <span className="shrink-0 text-(--color-text)">fig. 00</span>
          </p>
        </motion.div>
      </div>

      <div className="flex flex-col gap-4">
        <motion.div
          aria-hidden="true"
          className="h-px w-full origin-left bg-(--color-border)"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.4, delay: 0.2, ease: EASE }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col justify-between gap-2 font-mono text-[11px] text-(--color-text-muted) sm:flex-row sm:items-center"
        >
          <span className="text-(--color-text)">{profile.role}</span>
          <span className="flex items-center gap-6">
            {profile.status}
            <a
              href="#about"
              aria-label="Scroll to about"
              className="hidden transition-colors hover:text-(--color-text) md:block"
            >
              <motion.span
                className="block"
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ArrowDown size={15} />
              </motion.span>
            </a>
          </span>
        </motion.div>
      </div>
    </section>
  )
}
