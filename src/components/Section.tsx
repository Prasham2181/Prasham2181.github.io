import type { ReactNode } from 'react'
import { Rise } from './motion'

/**
 * One centered column per section: a small label, a plain title, an optional
 * standfirst, then the content. Hairline rule between sections, nothing else.
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
      className="mx-auto w-full max-w-5xl scroll-mt-14 border-t border-(--color-border) px-5 py-14 sm:px-8 sm:py-16"
    >
      <Rise>
        <div className="mb-10 flex flex-col gap-2">
          <p className="text-sm font-medium text-(--color-brand)">{eyebrow}</p>
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
