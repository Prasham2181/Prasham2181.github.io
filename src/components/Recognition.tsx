import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Section } from './Section'
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

function RecognitionRow({ row, index }: { row: Row; index: number }) {
  const content = (
    <>
      <span className="pt-0.5 font-mono text-xs text-(--color-text-muted) tabular-nums">
        {row.year}
      </span>
      <span className="min-w-0">
        <span className="block font-medium text-(--color-text) [text-wrap:balance]">
          {row.title}
        </span>
        <span className="mt-1 block text-sm text-(--color-text-muted) [text-wrap:pretty]">
          {row.detail}
        </span>
      </span>
      {row.href && (
        <ArrowUpRight
          size={18}
          className="mt-0.5 shrink-0 text-(--color-text-muted) transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      )}
    </>
  )

  const rowClass =
    'grid w-full grid-cols-[56px_1fr_auto] items-start gap-x-6 py-6 text-left sm:grid-cols-[200px_1fr_auto]'

  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.3) }}
      className="border-t border-(--color-border) last:border-b"
    >
      {row.href ? (
        <a
          href={row.href}
          target="_blank"
          rel="noreferrer"
          className={`group ${rowClass} transition-colors hover:bg-(--color-accent-soft)/60`}
        >
          {content}
        </a>
      ) : (
        <div className={rowClass}>{content}</div>
      )}
    </motion.li>
  )
}

export function Recognition() {
  return (
    <Section
      id="recognition"
      index="04"
      eyebrow="Recognition"
      title="Awards & publications"
      lede="Competition results, research funding, and peer-reviewed work."
    >
      <ol>
        {rows.map((row, i) => (
          <RecognitionRow key={row.title} row={row} index={i} />
        ))}
      </ol>
    </Section>
  )
}
