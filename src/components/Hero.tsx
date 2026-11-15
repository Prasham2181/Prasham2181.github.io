import { ArrowRight, FileText } from 'lucide-react'
import { profile } from '../data/profile'
import { Rise } from './motion'

/** Unsplash illustration, credit in public/hero/CREDITS.md */
const BACKDROP = '/hero/sunset-2800.webp'
const BACKDROP_SMALL = '/hero/sunset-1400.webp'

/**
 * Layout follows the reference site's hero exactly: an illustrated landscape
 * behind everything at ~54% under two gradients into the page colour, copy on
 * the left, and a small captioned personal photo on the right.
 */
export function Hero() {
  return (
    <section id="top" className="relative w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <img
          src={BACKDROP}
          srcSet={`${BACKDROP_SMALL} 1400w, ${BACKDROP} 2800w`}
          sizes="100vw"
          alt=""
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[center_35%] opacity-[0.54] dark:opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-(--color-bg)/20 via-(--color-bg)/55 to-(--color-bg)" />
        <div className="absolute inset-0 bg-gradient-to-r from-(--color-bg)/35 via-transparent to-(--color-bg)/20" />
      </div>

      <div className="relative mx-auto w-full max-w-5xl px-5 pt-14 pb-12 sm:px-8 md:pt-20 md:pb-16">
        <Rise>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(14rem,18rem)] lg:items-end lg:gap-12">
            <div className="min-w-0">
              <p className="mb-3 text-sm font-medium text-(--color-brand) md:text-base">
                Robotics · Perception · Controls
              </p>
              <h1 className="mb-4 text-4xl leading-tight font-semibold tracking-[-0.04em] text-(--color-text) md:text-5xl">
                Hi, I'm <span className="text-(--color-brand)">{profile.name}</span>.
              </h1>
              <p className="mb-3 max-w-2xl text-lg leading-relaxed text-(--color-text) md:text-xl">
                {profile.punchline}
              </p>
              <p className="mb-8 max-w-2xl text-[15px] leading-relaxed text-pretty text-(--color-text-muted)">
                {profile.tagline}
              </p>
              <div className="flex flex-wrap items-center gap-2.5">
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
                  className="inline-flex items-center gap-2 rounded-lg border border-(--color-border) bg-(--color-bg-raised)/70 px-5 py-2.5 text-sm font-medium text-(--color-text) transition-[border-color,scale] duration-150 hover:border-(--color-text) active:scale-[0.96]"
                >
                  <FileText size={15} /> View résumé
                </a>
              </div>
            </div>

            <figure className="w-full max-w-[18rem]">
              <div className="overflow-hidden rounded-xl border border-(--color-border) bg-(--color-accent-soft)">
                <img
                  src="/hero/me-rivian.webp"
                  alt="Prasham Soni at Rivian, in front of the plant floor"
                  className="block aspect-[4/5] h-auto w-full object-cover"
                />
              </div>
              <figcaption className="mt-2.5 text-sm leading-snug text-(--color-text-muted)">
                me at Rivian, on the right side of the safety glass.
              </figcaption>
            </figure>
          </div>
        </Rise>
      </div>
    </section>
  )
}
