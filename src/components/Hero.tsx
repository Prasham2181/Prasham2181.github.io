import { ArrowRight, FileText } from 'lucide-react'
import { profile } from '../data/profile'
import { Rise } from './motion'

/**
 * The trailhead: where the route starts. Copy on the left, a printed photo
 * pinned on the right. The background is the contour map in `.trail-bg`.
 */
export function Hero() {
  return (
    <section id="top" className="relative w-full">
      <div className="mx-auto w-full max-w-5xl px-5 pt-14 pb-14 sm:px-8 md:pt-20 md:pb-20">
        <Rise>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(15rem,19rem)] lg:items-center lg:gap-16">
            <div className="min-w-0">
              <p className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-(--color-text-muted)">
                <span className="inline-flex items-center gap-2 text-(--color-brand)">
                  <svg width="10" height="9" viewBox="0 0 10 9" fill="currentColor" aria-hidden="true">
                    <path d="M5 0 10 9H0z" />
                  </svg>
                  TRAILHEAD
                </span>
                <span>{profile.location}</span>
                <span className="tabular-nums">{profile.coords}</span>
              </p>
              <h1 className="text-5xl leading-[1.02] font-semibold tracking-[-0.045em] text-(--color-text) sm:text-7xl">
                {profile.name}
              </h1>
              <p className="mt-5 text-sm font-medium text-(--color-brand) md:text-base">
                Robotics · Perception · Controls
              </p>
              <p className="mt-4 max-w-xl text-xl leading-snug font-medium text-balance text-(--color-text) sm:text-2xl">
                {profile.punchline}
              </p>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-pretty text-(--color-text-muted)">
                {profile.tagline}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-2.5">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 rounded-lg bg-(--color-text) px-5 py-2.5 text-sm font-medium text-(--color-bg) transition-[opacity,scale] duration-150 hover:opacity-90 active:scale-[0.96]"
                >
                  Follow the route <ArrowRight size={15} />
                </a>
                <a
                  href={profile.links.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-(--color-border) bg-(--color-bg-raised) px-5 py-2.5 text-sm font-medium text-(--color-text) transition-[border-color,scale] duration-150 hover:border-(--color-text) active:scale-[0.96]"
                >
                  <FileText size={15} /> View résumé
                </a>
              </div>
              <p className="mt-6 font-mono text-xs text-(--color-text-muted)">{profile.status}</p>
            </div>

            <figure className="mx-auto w-full max-w-[19rem] rotate-[1.5deg] rounded-md border border-(--color-border) bg-(--color-bg-raised) p-2.5 pb-4 shadow-[0_10px_30px_-12px_rgba(60,50,30,0.35)] lg:mx-0">
              <img
                src="/trail/overlook.webp"
                alt="Prasham Soni standing on a granite ledge above Yosemite Valley"
                fetchPriority="high"
                className="block aspect-[4/5] w-full rounded-sm object-cover"
              />
              <figcaption className="mt-3 flex items-baseline justify-between gap-3 px-1">
                <span className="text-[13px] leading-snug text-(--color-text-muted)">
                  Depth estimation, human edition.
                </span>
                <span className="shrink-0 font-mono text-[10px] tracking-wider text-(--color-text-muted) uppercase">
                  Yosemite
                </span>
              </figcaption>
            </figure>
          </div>
        </Rise>
      </div>
    </section>
  )
}
