import type { ReactNode } from 'react'
import { Rise } from './motion'

/** Order along the trail; the label reads like a waypoint on a map. */
const WAYPOINT: Record<string, string> = {
  about: '01',
  journey: '02',
  projects: '03',
  recognition: '04',
  'off-trail': '05',
  contact: '06',
}

function Marker() {
  return (
    <svg width="10" height="9" viewBox="0 0 10 9" fill="currentColor" aria-hidden="true">
      <path d="M5 0 10 9H0z" />
    </svg>
  )
}

/**
 * One centred column per section: a waypoint label, a plain title, an optional
 * standfirst, then the content. A dashed rule between sections is the trail.
 */
export function Section({
  id,
  eyebrow,
  title,
  lede,
  children,
}: {
  id: string
  eyebrow: string
  title: string
  lede?: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      className="mx-auto w-full max-w-5xl scroll-mt-14 border-t border-dashed border-(--color-border) px-5 py-14 sm:px-8 sm:py-16"
    >
      <Rise>
        <div className="mb-10 flex flex-col gap-2">
          <p className="flex items-center gap-2 font-mono text-xs tracking-wider text-(--color-brand) uppercase">
            <Marker />
            <span className="tabular-nums">WP {WAYPOINT[id] ?? '00'}</span>
            <span aria-hidden="true">/</span>
            {eyebrow}
          </p>
          <h2 className="max-w-3xl text-3xl leading-tight font-semibold tracking-[-0.03em] text-(--color-text) sm:text-4xl">
            {title}
          </h2>
          {lede && (
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-pretty text-(--color-text-muted)">
              {lede}
            </p>
          )}
        </div>
      </Rise>
      {children}
    </section>
  )
}
