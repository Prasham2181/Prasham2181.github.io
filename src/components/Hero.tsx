import { ArrowRight, FileText } from 'lucide-react'
import { profile } from '../data/profile'
import { Rise } from './motion'

export function Hero() {
  return (
    <section id="top" className="relative w-full overflow-hidden">
      <div className="relative mx-auto w-full max-w-5xl px-5 pt-16 pb-14 sm:px-8 sm:pt-24 sm:pb-20">
      <Rise>
        <p className="mb-4 font-mono text-xs text-(--color-text-muted)">
          {profile.role} · {profile.location}
        </p>
        <h1 className="text-5xl leading-[1.02] font-semibold tracking-[-0.04em] text-(--color-text) sm:text-7xl">
          {profile.name}
        </h1>
        <p className="mt-6 max-w-2xl text-xl leading-snug font-medium text-balance text-(--color-text) sm:text-2xl">
          {profile.punchline}
        </p>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-pretty text-(--color-text-muted)">
          {profile.tagline}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-lg bg-(--color-text) px-5 py-2.5 text-sm font-medium text-(--color-bg) transition-[opacity,scale] duration-150 hover:opacity-90 active:scale-[0.96]"
          >
            View projects <ArrowRight size={15} />
          </a>
          <a
            href={profile.links.resume}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-(--color-border) px-5 py-2.5 text-sm font-medium text-(--color-text) transition-[border-color,scale] duration-150 hover:border-(--color-text) active:scale-[0.96]"
          >
            <FileText size={15} /> View résumé
          </a>
        </div>
        <p className="mt-8 font-mono text-xs text-(--color-text-muted)">{profile.status}</p>
      </Rise>
      </div>
    </section>
  )
}
