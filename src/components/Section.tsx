import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Words, Rise, Scramble } from './motion'

/** Small "+" registration cross, the calibration-mark motif used on section headers. */
export function RegMark() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" className="shrink-0" aria-hidden="true">
      <path d="M5 0v10M0 5h10" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

/**
 * The hairline that opens every section, drawn on as it scrolls into view. It is
 * the only thing separating sections now that they no longer each fill a screen.
 */
function Rule() {
  const reduced = useReducedMotion()
  return (
    <motion.div
      aria-hidden="true"
      className="h-px w-full origin-left bg-(--color-border)"
      initial={reduced ? undefined : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
    />
  )
}

/**
 * Every section is a two-column spread: a mono index that stays pinned while you
 * read, and the content. The pinned column is what tells you where you are now
 * that the sections do not each fill a viewport.
 */
export function Section({
  id,
  index,
  eyebrow,
  title,
  lede,
  children,
}: {
  id: string
  index: string
  eyebrow: string
  title: string
  /** the standfirst under the title, in the content column */
  lede?: string
  children: ReactNode
}) {
  return (
    <section id={id} className="w-full px-5 py-24 sm:px-10 sm:py-32">
      <Rule />
      <div className="pt-8 md:grid md:grid-cols-[10rem_minmax(0,1fr)] md:gap-16">
        <Rise className="md:sticky md:top-24 md:self-start">
          <p className="flex items-center gap-2.5 pt-2 pb-6 font-mono text-xs tracking-widest text-(--color-text-muted) uppercase md:pb-0">
            <RegMark />
            <span className="tabular-nums">{index}</span>
            <span aria-hidden="true">/</span>
            <Scramble text={eyebrow} />
          </p>
        </Rise>

        <div className="min-w-0">
          <Words
            as="h2"
            text={title}
            className="font-display text-4xl leading-[0.95] font-bold tracking-tight text-balance text-(--color-text) sm:text-6xl lg:text-7xl"
          />
          {lede && (
            <Rise delay={0.1}>
              <p className="mt-7 max-w-2xl text-base leading-relaxed text-pretty text-(--color-text-muted)">
                {lede}
              </p>
            </Rise>
          )}
          <div className="mt-14 sm:mt-20">{children}</div>
        </div>
      </div>
    </section>
  )
}
