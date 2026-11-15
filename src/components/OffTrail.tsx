import { profile } from '../data/profile'
import { Section } from './Section'
import { Rise } from './motion'

const prints = [
  { src: '/trail/ledge-wide.webp', alt: 'Prasham Soni sitting on a granite outcrop above Yosemite Valley', caption: 'A long way from a factory floor.', place: 'Yosemite', span: 'col-span-2', ratio: 'aspect-[16/9]' },
  { src: '/trail/meadow.webp', alt: 'Prasham Soni sitting on a fence rail in a golden meadow below granite cliffs', caption: 'Resting between waypoints.', place: 'Yosemite', span: '', ratio: 'aspect-[4/5]' },
  { src: '/trail/cliff.webp', alt: 'A granite ledge dropping into a forested valley', caption: 'Edge cases, handled with care.', place: 'Yosemite', span: '', ratio: 'aspect-[4/5]' },
  { src: '/trail/harry-potter.webp', alt: 'Prasham Soni outside the Harry Potter store in Chicago', caption: 'Off the clock.', place: 'Chicago', span: '', ratio: 'aspect-[4/5]' },
]

export function OffTrail() {
  return (
    <Section
      id="off-trail"
      eyebrow="Off the trail"
      title="Away from the keyboard"
      lede={`${profile.interests.map((s) => s.toLowerCase()).join(', ')}. Mostly outdoors, when the robots allow it.`}
    >
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-5 md:gap-4">
        {prints.map((p, i) => (
          <li key={p.src} className={p.span || "col-span-1"}>
            <Rise delay={i * 0.05}>
              <figure
                className={`rounded-md border border-(--color-border) bg-(--color-bg-raised) p-2 pb-3 shadow-[0_8px_24px_-14px_rgba(60,50,30,0.35)] ${
                  i % 2 === 0 ? '-rotate-[0.8deg]' : 'rotate-[0.8deg]'
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
            </Rise>
          </li>
        ))}
      </ul>
    </Section>
  )
}
