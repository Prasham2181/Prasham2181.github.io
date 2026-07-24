import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * Word-by-word mask reveal. Each word rides up from behind a clipping row, so
 * the line assembles instead of fading in as one block.
 */
export function Words({
  text,
  className = '',
  delay = 0,
  as = 'span',
}: {
  text: string
  className?: string
  delay?: number
  as?: 'span' | 'h1' | 'h2' | 'p'
}) {
  const reduced = useReducedMotion()
  const words = text.split(' ')

  if (reduced) {
    const Plain = as
    return <Plain className={className}>{text}</Plain>
  }

  // One observer on the line, driving the words through variants. Putting
  // whileInView on each word instead never fires: every word sits inside its own
  // clipping wrapper, so the observed element starts fully clipped out of it.
  const Tag = motion[as]

  return (
    <Tag
      className={className}
      variants={{ show: { transition: { delayChildren: delay, staggerChildren: 0.045 } } }}
      initial="hide"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
    >
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="inline-block overflow-hidden align-bottom">
            <motion.span
              className="inline-block"
              variants={{
                hide: { y: '110%' },
                show: { y: '0%', transition: { duration: 0.8, ease: EASE } },
              }}
            >
              {word}
            </motion.span>
          </span>
          {/* a real text node, not a space inside the mask: trailing whitespace in
              an inline-block collapses, and without it the line cannot wrap */}
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  )
}

/** Generic staggered rise. Use for anything that is not a headline. */
export function Rise({
  children,
  delay = 0,
  y = 22,
  className = '',
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.75, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

const GLYPHS = '#%$&/\\<>*+=-_[]{}0123456789'

/**
 * Resolves a short label out of noise, character by character, the way a readout
 * locks. Used only on the mono labels: it is the typographic echo of the scan in
 * the hero, and it would be unreadable at paragraph length.
 */
export function Scramble({
  text,
  className = '',
  delay = 0,
}: {
  text: string
  className?: string
  delay?: number
}) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [shown, setShown] = useState(text)

  useEffect(() => {
    if (!inView || reduced) return
    let frame = 0
    let raf = 0
    let timer = 0

    const tick = () => {
      // each character settles in turn; until it does, it cycles through noise
      const settled = frame / 2 - delay * 60
      setShown(
        text
          .split('')
          .map((ch, i) => {
            if (ch === ' ' || i < settled) return ch
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          })
          .join(''),
      )
      frame++
      if (settled < text.length) raf = requestAnimationFrame(tick)
      else setShown(text)
    }

    timer = window.setTimeout(() => {
      raf = requestAnimationFrame(tick)
    }, 10)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
    }
  }, [inView, reduced, text, delay])

  // the real string stays in the DOM for machines; only the visual layer scrambles
  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{shown}</span>
    </span>
  )
}

/**
 * Wipes a block in behind a moving edge instead of fading it. The image is the
 * subject, so it also drifts up slightly under the wipe: the frame arrives, then
 * settles.
 */
export function ScanReveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reduced = useReducedMotion()
  if (reduced) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      initial={{ clipPath: 'inset(0 100% 0 0)' }}
      whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
      viewport={{ once: true, margin: '-12%' }}
      transition={{ duration: 1.1, delay, ease: EASE }}
    >
      <motion.div
        initial={{ scale: 1.08 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: '-12%' }}
        transition={{ duration: 1.3, delay, ease: EASE }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

/**
 * Pulls toward the cursor while hovered. Applied to the primary calls to action
 * only, where the extra weight is worth it.
 */
export function Magnetic({
  children,
  strength = 0.32,
  className = '',
}: {
  children: ReactNode
  strength?: number
  className?: string
}) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  if (reduced) return <span className={className}>{children}</span>

  return (
    <motion.span
      ref={ref}
      className={`inline-block ${className}`}
      animate={offset}
      transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.4 }}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse' || !ref.current) return
        const r = ref.current.getBoundingClientRect()
        setOffset({
          x: (e.clientX - (r.left + r.width / 2)) * strength,
          y: (e.clientY - (r.top + r.height / 2)) * strength,
        })
      }}
      onPointerLeave={() => setOffset({ x: 0, y: 0 })}
    >
      {children}
    </motion.span>
  )
}
