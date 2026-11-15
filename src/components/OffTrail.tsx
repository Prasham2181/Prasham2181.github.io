import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { profile } from '../data/profile'
import { Section } from './Section'
import { Rise } from './motion'

type Print = {
  /** cropped print shown in the grid */
  src: string
  /** larger, uncropped photo shown in the viewer */
  full: string
  alt: string
  caption: string
  place: string
  span: string
  ratio: string
}

const prints: Print[] = [
  { src: '/trail/ledge-wide.webp', full: '/trail/full/ledge.webp', alt: 'Prasham Soni sitting on a granite outcrop above Yosemite Valley', caption: 'A long way from a factory floor.', place: 'Yosemite', span: 'col-span-2', ratio: 'aspect-[16/9]' },
  { src: '/trail/meadow.webp', full: '/trail/full/meadow.webp', alt: 'Prasham Soni sitting on a fence rail in a golden meadow below granite cliffs', caption: 'Resting between waypoints.', place: 'Yosemite', span: '', ratio: 'aspect-[4/5]' },
  { src: '/trail/cliff.webp', full: '/trail/full/cliff.webp', alt: 'A granite ledge dropping into a forested valley', caption: 'Edge cases, handled with care.', place: 'Yosemite', span: '', ratio: 'aspect-[4/5]' },
  { src: '/trail/harry-potter.webp', full: '/trail/full/harry-potter.webp', alt: 'Prasham Soni outside the Harry Potter store in Chicago', caption: 'Off the clock.', place: 'Chicago', span: '', ratio: 'aspect-[4/5]' },
]

/** Full-size viewer: Esc closes, arrow keys and the side buttons move between photos. */
function Viewer({
  index,
  onClose,
  onMove,
}: {
  index: number
  onClose: () => void
  onMove: (delta: number) => void
}) {
  const p = prints[index]
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') onMove(1)
      else if (e.key === 'ArrowLeft') onMove(-1)
    }
    window.addEventListener('keydown', onKey)
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = prev
    }
  }, [onClose, onMove])

  const nav =
    'absolute top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/45 text-white transition-colors hover:bg-black/70 active:scale-[0.96]'

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Photo: ${p.caption}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/92 p-4 sm:p-8"
    >
      <button ref={closeRef} type="button" onClick={onClose} aria-label="Close photo" className={`${nav} top-4 right-4 translate-y-0 sm:top-6 sm:right-6`}>
        <X size={18} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onMove(-1)
        }}
        aria-label="Previous photo"
        className={`${nav} left-3 sm:left-6`}
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onMove(1)
        }}
        aria-label="Next photo"
        className={`${nav} right-3 sm:right-6`}
      >
        <ChevronRight size={20} />
      </button>

      <figure className="max-h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <motion.img
          key={p.full}
          src={p.full}
          alt={p.alt}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="mx-auto block max-h-[78vh] w-auto max-w-full rounded-md object-contain shadow-2xl"
        />
        <figcaption className="mt-3 flex items-baseline justify-between gap-4 text-sm text-white/85">
          <span>{p.caption}</span>
          <span className="shrink-0 font-mono text-[11px] tracking-wider text-white/60 uppercase tabular-nums">
            {p.place} · {index + 1} / {prints.length}
          </span>
        </figcaption>
      </figure>
    </motion.div>
  )
}

export function OffTrail() {
  const [open, setOpen] = useState<number | null>(null)
  const close = useCallback(() => setOpen(null), [])
  const move = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + prints.length) % prints.length)), [])

  return (
    <Section
      id="off-trail"
      eyebrow="Off the trail"
      title="Away from the keyboard"
      lede={`${profile.interests.map((s) => s.toLowerCase()).join(', ')}. Mostly outdoors, when the robots allow it.`}
    >
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-5 md:gap-4">
        {prints.map((p, i) => (
          <li key={p.src} className={p.span || 'col-span-1'}>
            <Rise delay={i * 0.05}>
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`Open photo: ${p.caption}`}
                className="group block w-full cursor-zoom-in text-left"
              >
                <figure
                  className={`rounded-md border border-(--color-border) bg-(--color-bg-raised) p-2 pb-3 shadow-[0_8px_24px_-14px_rgba(60,50,30,0.35)] transition-[transform,box-shadow] duration-300 group-hover:-translate-y-1 group-hover:rotate-0 group-hover:shadow-[0_14px_30px_-14px_rgba(60,50,30,0.5)] ${
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
              </button>
            </Rise>
          </li>
        ))}
      </ul>

      <AnimatePresence>{open !== null && <Viewer index={open} onClose={close} onMove={move} />}</AnimatePresence>
    </Section>
  )
}
