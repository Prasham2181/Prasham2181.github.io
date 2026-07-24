import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * An optical-flow field, generated.
 *
 * This is the visualization my motion-perception work at Rivian (RAFT /
 * MemFlowNet) actually output: a flow field colour-coded by direction the way
 * RAFT and the Middlebury convention render it (hue = flow direction, brightness
 * = magnitude). A smooth procedural field drifts on its own; a vector grid draws
 * the field itself; particles are advected through it as fading streaks; and
 * feature tracks (keypoints with trails) are carried through it, the structure-
 * from-motion / SLAM read on the same field. The cursor is a moving object that
 * injects flow around it: move it and you are generating the optical flow the
 * field estimates.
 *
 * Nothing here is an image asset. It is the field, evaluated every frame.
 */

const CELL = 30
/** how strongly the cursor's motion injects flow, and how fast that decays */
const INJECT = 2.6
const DECAY = 0.94
const TAU = Math.PI * 2

type V = { x: number; y: number }

/** hue→rgb at full saturation; v scales value. Returns a css rgb() string. */
function flowColor(angle: number, mag: number): string {
  const h = (((angle / TAU) % 1) + 1) % 1
  const v = Math.min(0.25 + mag * 0.9, 1)
  const i = Math.floor(h * 6)
  const f = h * 6 - i
  const p = 0
  const q = v * (1 - f)
  const t = v * f
  let r = 0
  let g = 0
  let b = 0
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break
    case 1: r = q; g = v; b = p; break
    case 2: r = p; g = v; b = t; break
    case 3: r = p; g = q; b = v; break
    case 4: r = t; g = p; b = v; break
    default: r = v; g = p; b = q
  }
  return `rgb(${(r * 255) | 0},${(g * 255) | 0},${(b * 255) | 0})`
}

export function FlowField({
  className = '',
  onVectors,
}: {
  className?: string
  onVectors?: (n: number) => void
}) {
  const reduced = useReducedMotion()
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const pointer = useRef<{ x: number; y: number; vx: number; vy: number } | null>(null)

  useEffect(() => {
    const el = wrap.current
    const cv = canvas.current
    if (!el || !cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    let cols = 0
    let rows = 0
    let inject: V[] = [] // per-cell decaying cursor contribution
    let particles: { x: number; y: number; px: number; py: number; life: number }[] = []
    let raf = 0
    let alive = true
    let last = performance.now()

    // feature tracks: keypoints carried by the flow, each holding a short trail of
    // its recent positions. The structure-from-motion / SLAM read on the field.
    type Track = { x: number; y: number; trail: number[]; life: number }
    let tracks: Track[] = []
    const TRAIL = 14

    const build = () => {
      const r = el.getBoundingClientRect()
      if (r.width < 2 || r.height < 2) return
      w = Math.round(r.width)
      h = Math.round(r.height)
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      cv.width = w * dpr
      cv.height = h * dpr
      cv.style.width = `${w}px`
      cv.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      cols = Math.ceil(w / CELL) + 1
      rows = Math.ceil(h / CELL) + 1
      inject = Array.from({ length: cols * rows }, () => ({ x: 0, y: 0 }))

      const count = Math.min(700, Math.round((w * h) / 900))
      particles = Array.from({ length: count }, () => {
        const x = Math.random() * w
        const y = Math.random() * h
        return { x, y, px: x, py: y, life: Math.random() }
      })

      const nTracks = Math.min(140, Math.round((w * h) / 3600))
      tracks = Array.from({ length: nTracks }, () => {
        const x = Math.random() * w
        const y = Math.random() * h
        return { x, y, trail: [x, y], life: Math.random() * TRAIL * 4 }
      })
      onVectors?.(nTracks)
    }

    /** the base procedural field: a smooth, slowly swirling flow */
    const base = (x: number, y: number, t: number): V => {
      const nx = x / w
      const ny = y / h
      const a =
        Math.sin(nx * 3 + t * 0.3) +
        Math.cos(ny * 3.4 - t * 0.24) +
        Math.sin((nx + ny) * 2.2 + t * 0.2)
      const angle = a * 1.1 + t * 0.06
      return { x: Math.cos(angle), y: Math.sin(angle) }
    }

    /** field = base + decaying cursor injection, sampled at a pixel */
    const sample = (x: number, y: number, t: number): V => {
      const b = base(x, y, t)
      const ci = Math.min(cols - 1, Math.max(0, Math.round(x / CELL)))
      const cj = Math.min(rows - 1, Math.max(0, Math.round(y / CELL)))
      const inj = inject[cj * cols + ci]
      return { x: b.x + inj.x, y: b.y + inj.y }
    }

    const draw = (now: number) => {
      if (!alive) return
      raf = requestAnimationFrame(draw)
      if (cols === 0) return
      const t = now / 1000
      const dt = Math.min((now - last) / 16.67, 2)
      last = now

      // decay every cell's injected flow toward zero
      for (const cell of inject) {
        cell.x *= DECAY
        cell.y *= DECAY
      }

      // stamp a moving emitter's velocity into the cells within its radius
      const stamp = (ex: number, ey: number, vx: number, vy: number, rad: number, s: number) => {
        const i0 = Math.max(0, Math.floor((ex - rad) / CELL))
        const i1 = Math.min(cols - 1, Math.ceil((ex + rad) / CELL))
        const j0 = Math.max(0, Math.floor((ey - rad) / CELL))
        const j1 = Math.min(rows - 1, Math.ceil((ey + rad) / CELL))
        for (let j = j0; j <= j1; j++) {
          for (let i = i0; i <= i1; i++) {
            const dx = i * CELL - ex
            const dy = j * CELL - ey
            const d = Math.hypot(dx, dy)
            if (d > rad) continue
            const fall = (1 - d / rad) ** 2
            const cell = inject[j * cols + i]
            cell.x += (vx * s * fall - cell.x) * 0.3
            cell.y += (vy * s * fall - cell.y) * 0.3
          }
        }
      }

      const p = pointer.current
      if (p) {
        stamp(p.x, p.y, p.vx, p.vy, 150, INJECT)
        p.vx *= 0.82
        p.vy *= 0.82
      }

      // trail: fade the previous frame rather than clearing, so streaks persist
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = 'rgba(9,10,12,0.22)'
      ctx.fillRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'

      // the vector grid: the unmistakable "flow field" signature
      ctx.lineWidth = 1
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const x = i * CELL
          const y = j * CELL
          const f = sample(x, y, t)
          const mag = Math.hypot(f.x, f.y)
          const ang = Math.atan2(f.y, f.x)
          const len = Math.min(mag * 9, CELL * 0.7)
          ctx.strokeStyle = flowColor(ang, Math.min(mag * 0.5, 1))
          ctx.globalAlpha = 0.35
          ctx.beginPath()
          ctx.moveTo(x, y)
          ctx.lineTo(x + Math.cos(ang) * len, y + Math.sin(ang) * len)
          ctx.stroke()
        }
      }

      // particles advected through the field, drawn as streaks
      ctx.globalAlpha = 0.9
      ctx.lineWidth = 1.4
      for (const pt of particles) {
        const f = sample(pt.x, pt.y, t)
        const speed = reduced ? 0.3 : 1
        pt.px = pt.x
        pt.py = pt.y
        pt.x += f.x * 14 * speed * dt
        pt.y += f.y * 14 * speed * dt
        pt.life -= 0.005 * dt

        if (pt.life <= 0 || pt.x < 0 || pt.x > w || pt.y < 0 || pt.y > h) {
          pt.x = Math.random() * w
          pt.y = Math.random() * h
          pt.px = pt.x
          pt.py = pt.y
          pt.life = 0.6 + Math.random() * 0.6
          continue
        }
        const ang = Math.atan2(pt.y - pt.py, pt.x - pt.px)
        const mag = Math.hypot(f.x, f.y)
        ctx.strokeStyle = flowColor(ang, Math.min(mag * 0.6, 1))
        ctx.beginPath()
        ctx.moveTo(pt.px, pt.py)
        ctx.lineTo(pt.x, pt.y)
        ctx.stroke()
      }

      // feature tracks: carried by the flow, drawing a trail then a marker
      ctx.globalCompositeOperation = 'source-over'
      for (const tr of tracks) {
        const f = sample(tr.x, tr.y, t)
        const speed = reduced ? 0.3 : 1
        tr.x += f.x * 12 * speed * dt
        tr.y += f.y * 12 * speed * dt
        tr.life -= dt

        if (tr.life <= 0 || tr.x < 2 || tr.x > w - 2 || tr.y < 2 || tr.y > h - 2) {
          tr.x = Math.random() * w
          tr.y = Math.random() * h
          tr.trail = [tr.x, tr.y]
          tr.life = TRAIL * (3 + Math.random() * 3)
          continue
        }

        tr.trail.push(tr.x, tr.y)
        if (tr.trail.length > TRAIL * 2) tr.trail.splice(0, 2)

        const ang = Math.atan2(f.y, f.x)
        const col = flowColor(ang, 1)

        ctx.lineWidth = 1
        for (let k = 2; k < tr.trail.length; k += 2) {
          ctx.globalAlpha = (k / tr.trail.length) * 0.55
          ctx.strokeStyle = col
          ctx.beginPath()
          ctx.moveTo(tr.trail[k - 2], tr.trail[k - 1])
          ctx.lineTo(tr.trail[k], tr.trail[k + 1])
          ctx.stroke()
        }

        ctx.globalAlpha = 0.95
        ctx.strokeStyle = 'rgba(255,255,255,0.9)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(tr.x - 3, tr.y)
        ctx.lineTo(tr.x + 3, tr.y)
        ctx.moveTo(tr.x, tr.y - 3)
        ctx.lineTo(tr.x, tr.y + 3)
        ctx.stroke()
      }

      ctx.globalAlpha = 1
    }

    let resizeTimer = 0
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(build, 150)
    })
    ro.observe(el)

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const r = el.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      if (x < 0 || y < 0 || x > r.width || y > r.height) {
        pointer.current = null
        return
      }
      const prev = pointer.current
      pointer.current = {
        x,
        y,
        vx: prev ? x - prev.x : 0,
        vy: prev ? y - prev.y : 0,
      }
    }
    window.addEventListener('pointermove', onMove)

    build()
    raf = requestAnimationFrame(draw)

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      clearTimeout(resizeTimer)
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
    }
  }, [reduced, onVectors])

  return (
    <div ref={wrap} className={`bg-[#090a0c] ${className}`}>
      <canvas ref={canvas} aria-hidden="true" className="h-full w-full" />
    </div>
  )
}
