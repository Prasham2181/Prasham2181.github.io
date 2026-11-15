import { ArrowUpRight } from 'lucide-react'
import { Section } from './Section'
import { Rise } from './motion'
import { awards } from '../data/awards'
import { publications } from '../data/publications'

type Row = {
  year: string
  title: string
  detail: string
  href?: string
}

const rows: Row[] = [
  ...publications.map((pub) => ({
    year: pub.date.slice(-4),
    title: pub.title,
    detail: pub.venue,
    href: pub.href,
  })),
  ...awards,
].sort((a, b) => Number(b.year) - Number(a.year))

function Card({ row }: { row: Row }) {
  const inner = (
    <>
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[11px] text-(--color-text-muted) tabular-nums">{row.year}</span>
        {row.href && (
          <ArrowUpRight
            size={15}
            className="text-(--color-text-muted) transition-[color,translate] duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-(--color-brand)"
          />
        )}
      </div>
      <p className="mt-2 text-[15px] leading-snug font-medium text-pretty text-(--color-text)">{row.title}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-pretty text-(--color-text-muted)">{row.detail}</p>
    </>
  )
  const cls =
    'group block h-full rounded-xl border border-(--color-border) bg-(--color-bg-raised) p-5 transition-colors duration-150'
  return row.href ? (
    <a href={row.href} target="_blank" rel="noreferrer" className={`${cls} hover:border-(--color-text-muted)`}>
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  )
}

export function Recognition() {
  return (
    <Section
      id="recognition"
      eyebrow="Recognition"
      title="Awards & publications"
      lede="Competition results, research funding, and peer-reviewed work."
    >
      <ul className="grid gap-4 md:grid-cols-2">
        {rows.map((row, i) => (
          <li key={row.title}>
            <Rise delay={Math.min(i * 0.04, 0.2)} className="h-full">
              <Card row={row} />
            </Rise>
          </li>
        ))}
      </ul>
    </Section>
  )
}
