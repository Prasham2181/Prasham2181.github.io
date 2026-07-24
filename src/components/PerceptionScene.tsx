import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  classColor,
  imageWidths,
  perceptionImages,
  type Detection,
  type PerceptionImage,
} from '../data/perception'

const CYCLE_MS = 9000
/** with no pointer, the detector walks its own hits at this rate */
const WALK_MS = 1800

type Pt = { x: number; y: number }
type Box = Detection & { key: string }

/**
 * Map an image-% point into frame-% under `object-cover` with an
 * `object-position` of (focus.x%, focus.y%). Aspects are width/height.
 */
function coverPoint(x: number, y: number, img: PerceptionImage, cAspect: number): Pt {
  if (cAspect >= img.aspect) {
    const s = cAspect / img.aspect
    return { x, y: y * s - (s - 1) * img.focus.y }
  }
  const s = img.aspect / cAspect
  return { x: x * s - (s - 1) * img.focus.x, y }
}

/**
 * Cover-map a detection, then clamp it to the visible frame. Anything mostly
 * cropped away is dropped, so a box never floats over an object the viewer
 * cannot see, which is the failure mode that makes an overlay look fake.
 */
function coverBox(d: Detection, i: number, img: PerceptionImage, cAspect: number): Box | null {
  const p = coverPoint(d.x, d.y, img, cAspect)
  const sw = cAspect >= img.aspect ? 1 : img.aspect / cAspect
  const sh = cAspect >= img.aspect ? cAspect / img.aspect : 1
  const w = d.w * sw
  const h = d.h * sh
  const x1 = Math.max(0, p.x)
  const y1 = Math.max(0, p.y)
  const x2 = Math.min(100, p.x + w)
  const y2 = Math.min(100, p.y + h)
  if (x2 <= x1 || y2 <= y1) return null
  if (((x2 - x1) * (y2 - y1)) / (w * h) < 0.4) return null
  return { ...d, key: `${img.name}-${i}`, x: x1, y: y1, w: x2 - x1, h: y2 - y1 }
}

function distanceTo(b: Box, p: Pt) {
  const dx = Math.max(b.x - p.x, 0, p.x - (b.x + b.w))
  const dy = Math.max(b.y - p.y, 0, p.y - (b.y + b.h))
  return Math.hypot(dx, dy)
}

function DetectionBox({ box, active, delay }: { box: Box; active: boolean; delay: number }) {
  const color = classColor[box.family]
  // keep the chip in frame: below the box near the top edge, right-aligned near the right
  const chipBelow = box.y < 9
  const chipRight = box.x + box.w > 84 && box.x > 20

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ duration: 0.25, delay }}
      style={{ left: `${box.x}%`, top: `${box.y}%`, width: `${box.w}%`, height: `${box.h}%` }}
      className="pointer-events-none absolute"
    >
      <motion.div
        animate={{
          opacity: active ? 1 : 0.4,
          boxShadow: active ? `0 0 20px ${color}55` : '0 0 0 transparent',
        }}
        transition={{ duration: 0.18 }}
        style={{ borderColor: color }}
        className={`absolute inset-0 border ${active ? 'border-2' : ''}`}
      />
      {active &&
        (['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'] as const).map(
          (pos) => (
            <span
              key={pos}
              style={{ backgroundColor: color }}
              className={`absolute h-[3px] w-[3px] ${pos}`}
            />
          ),
        )}

      <AnimatePresence>
        {active && (
          <motion.span
            initial={{ opacity: 0, y: chipBelow ? -3 : 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.14 }}
            style={{ backgroundColor: color }}
            className={`absolute flex items-center gap-1 px-1.5 py-[3px] font-mono text-[10px] leading-none whitespace-nowrap text-black tabular-nums ${
              chipBelow ? 'top-full' : 'bottom-full'
            } ${chipRight ? 'right-0' : 'left-0'}`}
          >
            <span className="font-medium">{box.cls}</span>
            <span className="opacity-65">{box.conf.toFixed(2)}</span>
            {box.dist !== undefined && <span className="opacity-65">· {box.dist}m</span>}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/** ticks on the inside corners of the frame, like a viewfinder */
function FrameTicks() {
  const base = 'absolute h-4 w-4 border-white/45'
  return (
    <div className="pointer-events-none absolute inset-3 sm:inset-4" aria-hidden="true">
      <span className={`${base} top-0 left-0 border-t border-l`} />
      <span className={`${base} top-0 right-0 border-t border-r`} />
      <span className={`${base} bottom-0 left-0 border-b border-l`} />
      <span className={`${base} right-0 bottom-0 border-r border-b`} />
    </div>
  )
}

/**
 * A camera feed with a live detector on it. The photos cycle, a scan line sweeps
 * each new frame and the boxes latch on as it passes. With a mouse the cursor
 * drives which object is locked; with no pointer the detector walks its own hits,
 * which is what makes the idea legible on touch.
 */
export function PerceptionScene({
  aspect = 'aspect-[16/9] sm:aspect-[21/9]',
}: {
  /** the frame it is mounted in decides the shape; the crop maths follows */
  aspect?: string
}) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [idx, setIdx] = useState(0)
  const [cAspect, setCAspect] = useState<number | null>(null)
  const [cursor, setCursor] = useState<Pt | null>(null)
  const [walk, setWalk] = useState(0)
  const [tc, setTc] = useState(0)

  const image = perceptionImages[idx]

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      if (el.clientHeight > 0) {
        // quantized so a scrollbar appearing does not re-solve every box
        setCAspect(Math.round((el.clientWidth / el.clientHeight) * 20) / 20)
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % perceptionImages.length), CYCLE_MS)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setTc((v) => v + 1), 1000)
    return () => clearInterval(t)
  }, [])

  const boxes = useMemo(() => {
    if (!cAspect) return []
    return image.detections
      .map((d, i) => coverBox(d, i, image, cAspect))
      .filter((b): b is Box => b !== null)
  }, [image, cAspect])

  useEffect(() => {
    setWalk(0)
    if (cursor || reduced || boxes.length === 0) return
    const t = setInterval(() => setWalk((w) => (w + 1) % boxes.length), WALK_MS)
    return () => clearInterval(t)
  }, [cursor, reduced, boxes.length])

  let hits: Box[] = []
  if (boxes.length > 0) {
    if (cursor) {
      const under = boxes.filter(
        (b) => cursor.x >= b.x && cursor.x <= b.x + b.w && cursor.y >= b.y && cursor.y <= b.y + b.h,
      )
      // never go dead: with nothing under the cursor, lock the nearest object
      hits =
        under.length > 0
          ? under
          : [boxes.reduce((a, b) => (distanceTo(b, cursor) < distanceTo(a, cursor) ? b : a))]
    } else {
      hits = [boxes[walk % boxes.length]]
    }
  }
  const activeKeys = new Set(hits.map((h) => h.key))

  const mm = String(Math.floor(tc / 60)).padStart(2, '0')
  const ss = String(tc % 60).padStart(2, '0')

  return (
    <div
      ref={ref}
      className={`relative w-full overflow-hidden bg-black outline outline-black/10 dark:outline-white/10 ${aspect}`}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return
        const r = e.currentTarget.getBoundingClientRect()
        setCursor({
          x: ((e.clientX - r.left) / r.width) * 100,
          y: ((e.clientY - r.top) / r.height) * 100,
        })
      }}
      onPointerLeave={() => setCursor(null)}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={image.name}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 0.7 },
            scale: { duration: reduced ? 0 : CYCLE_MS / 1000 + 1, ease: 'linear' },
          }}
          style={{ backgroundImage: `url(${image.lqip})` }}
          className="absolute inset-0 bg-cover bg-center"
        >
          <img
            src={`/perception/${image.name}-1920.webp`}
            srcSet={imageWidths.map((w) => `/perception/${image.name}-${w}.webp ${w}w`).join(', ')}
            sizes="100vw"
            alt=""
            aria-hidden="true"
            loading="lazy"
            style={{ objectPosition: `${image.focus.x}% ${image.focus.y}%` }}
            className="h-full w-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* a real sensor feed is never a clean photo: vignette and a contrast plate */}
      <div className="pointer-events-none absolute inset-0 bg-black/15" />
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_140px_40px_rgba(0,0,0,0.55)]" />

      <AnimatePresence mode="popLayout">
        {boxes.map((box, i) => (
          <DetectionBox
            key={box.key}
            box={box}
            active={activeKeys.has(box.key)}
            delay={reduced ? 0 : Math.min(i * 0.06, 0.4)}
          />
        ))}
      </AnimatePresence>

      <FrameTicks />

      <div className="pointer-events-none absolute inset-x-3 top-3 flex items-center justify-between font-mono text-[10px] tracking-widest text-white/70 uppercase sm:inset-x-6 sm:top-5 sm:text-[11px]">
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
          <span className="text-white">live</span>
        </span>
        <span className="tabular-nums">
          00:{mm}:{ss}
        </span>
      </div>

      <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-end justify-between gap-4 font-mono text-[10px] tracking-widest text-white/60 uppercase sm:inset-x-6 sm:bottom-5 sm:text-[11px]">
        <span className="text-white">{image.task}</span>
        <span className="tabular-nums">
          {boxes.length} obj / {hits.length} lock
        </span>
      </div>
    </div>
  )
}
