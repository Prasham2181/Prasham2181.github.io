import { useEffect, useState } from 'react'
import { profile } from '../data/profile'
import { Section } from './Section'
import { Rise } from './motion'

type Print = {
  src: string
  alt: string
  caption: string
  place: string
  span: string
  ratio: string
  /** grow away from the nearest edge so an enlarged print never leaves the column */
  origin: string
}

const prints: Print[] = [
  { src: '/trail/ledge-wide.webp', alt: 'Prasham Soni sitting on a granite outcrop above Yosemite Valley', caption: 'A long way from a factory floor.', place: 'Yosemite', span: 'col-span-2', ratio: 'aspect-[16/9]', origin: 'origin-left' },
  { src: '/trail/meadow.webp', alt: 'Prasham Soni sitting on a fence rail in a golden meadow below granite cliffs', caption: 'Resting between waypoints.', place: 'Yosemite', span: '', ratio: 'aspect-[4/5]', origin: 'origin-center' },
  { src: '/trail/cliff.webp', alt: 'A granite ledge dropping into a forested valley', caption: 'Edge cases, handled with care.', place: 'Yosemite', span: '', ratio: 'aspect-[4/5]', origin: 'origin-center' },
  { src: '/trail/harry-potter.webp', alt: 'Prasham Soni outside the Harry Potter store in Chicago', caption: 'Off the clock.', place: 'Chicago', span: '', ratio: 'aspect-[4/5]', origin: 'origin-right' },
]

export function OffTrail() {
  const [active, setActive] = useState<number | null>(null)

  // Esc or a click anywhere else puts the print back
  useEffect(() => {
    if (active === null) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setActive(null)
    const onClick = () => setActive(null)
    window.addEventListener('keydown', onKey)
    // deferred so the click that opened it does not immediately close it
    const t = window.setTimeout(() => window.addEventListener('click', onClick), 0)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('click', onClick)
      window.clearTimeout(t)
    }
  }, [active])

  return (
    <Section
      id="off-trail"
      eyebrow="Off the trail"
      title="Away from the keyboard"
      lede={`${profile.interests.map((s) => s.toLowerCase()).join(', ')}. Mostly outdoors, when the robots allow it.`}
    >
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-5 md:gap-4">
        {prints.map((p, i) => {
          const on = active === i
          return (
            <li key={p.src} className={`${p.span || 'col-span-1'} ${on ? 'relative z-30' : 'relative z-0'}`}>
              <Rise delay={i * 0.05}>
                <button
                  type="button"
                  onClick={() => setActive(on ? null : i)}
                  aria-pressed={on}
                  aria-label={`${on ? 'Shrink' : 'Enlarge'} photo: ${p.caption}`}
                  className={`group block w-full text-left ${on ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                >
                  <figure
                    className={`${p.origin} rounded-md border border-(--color-border) bg-(--color-bg-raised) p-2 pb-3 transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      on
                        ? 'scale-[1.22] rotate-0 shadow-[0_24px_50px_-18px_rgba(40,30,15,0.55)] sm:scale-[1.3]'
                        : `shadow-[0_8px_24px_-14px_rgba(60,50,30,0.35)] group-hover:scale-[1.03] ${
                            i % 2 === 0 ? '-rotate-[0.8deg]' : 'rotate-[0.8deg]'
                          }`
                    }`}
                  >
                    <img
                      src={p.src}
                      alt={p.alt}
                      loading="lazy"
                      decoding="async"
                      className={`block w-full rounded-sm object-cover ${p.ratio} ${p.span ? 'sm:aspect-[8/5]' : ''}`}
                    />
                    <figcaption className="mt-2.5 flex items-baseline justify-between gap-2 px-0.5">
                      <span className="text-[12px] leading-snug text-(--color-text-muted)">{p.caption}</span>
                      <span className="shrink-0 font-mono text-[9px] tracking-wider text-(--color-text-muted) uppercase">
                        {p.place}
                      </span>
                    </figcaption>
                  </figure>
                </button>
              </Rise>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
