import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { classColor, type ClassFamily } from '../data/perception'

/**
 * The detector, pointed at the page.
 *
 * The whole site claims a model can find things in a frame. This runs that claim
 * on the site itself: the page becomes the input image, and every element
 * carrying `data-detect` comes back as a labelled box with a confidence. The
 * geometry is not faked; the boxes are the elements' real bounding rects, read
 * every frame, which is why they stay locked while you scroll.
 *
 * Confidences are a stable hash of the label, so an element always scores the
 * same. A number that changed every frame would read as decoration rather than a
 * detector.
 */

type Hit = {
  id: string
  label: string
  family: ClassFamily
  conf: number
  x: number
  y: number
  w: number
  h: number
  /** true once the opening sweep has passed this box */
  locked: boolean
}

/** stable pseudo-confidence in [0.81, 0.99] */
function confidence(label: string): number {
  let hash = 0
  for (let i = 0; i < label.length; i++) hash = (hash * 31 + label.charCodeAt(i)) >>> 0
  return 0.81 + (hash % 19) / 100
}

const FAMILIES: ClassFamily[] = ['vehicle', 'vru', 'signal', 'structure', 'asset']

/** the four ticks that make a box read as a detection rather than a border */
function Ticks({ color }: { color: string }) {
  const arm = 'absolute h-2.5 w-2.5 border-current'
  return (
    <span className="pointer-events-none absolute -inset-px text-current" style={{ color }}>
      <span className={`${arm} -top-px -left-px border-t-2 border-l-2`} />
      <span className={`${arm} -top-px -right-px border-t-2 border-r-2`} />
      <span className={`${arm} -bottom-px -left-px border-b-2 border-l-2`} />
      <span className={`${arm} -right-px -bottom-px border-r-2 border-b-2`} />
    </span>
  )
}

export function DetectOverlay({ active }: { active: boolean }) {
  const reduced = useReducedMotion()
  const [hits, setHits] = useState<Hit[]>([])

  useEffect(() => {
    if (!active) {
      setHits([])
      return
    }

    const opened = performance.now()
    let raf = 0

    const scan = () => {
      raf = requestAnimationFrame(scan)
      // the sweep takes 900ms to cross; a box only locks once it has been passed
      const swept = reduced ? 2 : (performance.now() - opened) / 900
      const next: Hit[] = []
      const nodes = document.querySelectorAll<HTMLElement>('[data-detect]')

      nodes.forEach((node, i) => {
        const r = node.getBoundingClientRect()
        // a detector does not report outside the frame
        if (r.bottom < 8 || r.top > window.innerHeight - 8) return
        if (r.width < 32 || r.height < 16) return

        const label = node.dataset.detect ?? 'object'
        const family = (node.dataset.family ?? FAMILIES[i % FAMILIES.length]) as ClassFamily
        const top = Math.max(r.top, 6)
        next.push({
          id: `${label}-${i}`,
          label,
          family: family in classColor ? family : 'asset',
          conf: confidence(label),
          x: r.left,
          y: top,
          w: r.width,
          h: Math.min(r.bottom, window.innerHeight - 6) - top,
          locked: swept > r.left / window.innerWidth,
        })
      })
      setHits(next)
    }

    raf = requestAnimationFrame(scan)
    return () => cancelAnimationFrame(raf)
  }, [active, reduced])

  const families = [...new Set(hits.map((h) => h.family))]

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="pointer-events-none fixed inset-0 z-40"
          aria-hidden="true"
        >
          {/* the sweep that opens the pass */}
          {!reduced && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-y-0 w-28 bg-gradient-to-r from-transparent to-(--color-text)/20"
            />
          )}

          {hits.map((hit) => {
            const color = classColor[hit.family]
            return (
              <motion.div
                key={hit.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: hit.locked ? 1 : 0.25 }}
                transition={{ duration: 0.2 }}
                className="absolute"
                style={{
                  left: hit.x,
                  top: hit.y,
                  width: hit.w,
                  height: hit.h,
                  border: `1px solid ${hit.locked ? color : `${color}66`}`,
                  boxShadow: hit.locked ? `inset 0 0 30px ${color}14` : 'none',
                }}
              >
                {hit.locked && <Ticks color={color} />}

                {/* the chip hangs above the box, and flips inside it at the top of
                    the viewport so it is never clipped off-screen */}
                <span
                  className={`absolute left-[-1px] flex items-center gap-1.5 px-1.5 py-[3px] font-mono text-[10px] leading-none whitespace-nowrap text-black tabular-nums ${
                    hit.y < 28 ? 'top-0' : '-top-[17px]'
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {hit.label}
                  <span className="opacity-65">{hit.conf.toFixed(2)}</span>
                </span>
              </motion.div>
            )
          })}

          {/* the readout. Bottom-left belongs to the status bar. */}
          <div className="absolute right-5 bottom-4 flex flex-col gap-2 border border-(--color-border) bg-(--color-bg)/90 px-3 py-2.5 font-mono text-[10px] tracking-widest text-(--color-text-muted) uppercase backdrop-blur-sm sm:right-10">
            <span className="flex items-center gap-3">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--color-perception) opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-(--color-perception)" />
              </span>
              detector active
              <span className="tabular-nums text-(--color-text)">{hits.length} objects</span>
            </span>
            {families.length > 0 && (
              <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-(--color-border) pt-2">
                {families.map((f) => (
                  <span key={f} className="flex items-center gap-1.5">
                    <span
                      className="h-1.5 w-1.5 rounded-[1px]"
                      style={{ backgroundColor: classColor[f] }}
                    />
                    {f}
                  </span>
                ))}
              </span>
            )}
            <span className="border-t border-(--color-border) pt-2 normal-case">
              Press <span className="text-(--color-text)">D</span> or Esc to exit
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
