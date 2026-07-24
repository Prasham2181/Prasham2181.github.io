import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

/**
 * A short boot sequence, framed as a sensor coming online. It runs once per tab
 * (sessionStorage), so navigating back into the site does not replay it.
 */
const STEPS = ['calibrating intrinsics', 'loading depth prior', 'point cloud ready']
const STEP_MS = 380

export function Loader() {
  const reduced = useReducedMotion()
  const [done, setDone] = useState(
    () => reduced || sessionStorage.getItem('booted') === '1',
  )
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (done) return
    document.body.style.overflow = 'hidden'
    const tick = setInterval(() => setStep((s) => s + 1), STEP_MS)
    const end = setTimeout(() => {
      sessionStorage.setItem('booted', '1')
      setDone(true)
    }, STEPS.length * STEP_MS + 320)
    return () => {
      clearInterval(tick)
      clearTimeout(end)
      document.body.style.overflow = ''
    }
  }, [done])

  useEffect(() => {
    if (done) document.body.style.overflow = ''
  }, [done])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="boot"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex flex-col justify-end bg-(--color-bg) px-5 pb-8 sm:px-10"
        >
          <div className="flex items-end justify-between gap-6 font-mono text-xs text-(--color-text-muted)">
            <ul className="space-y-1">
              {STEPS.map((label, i) => (
                <li
                  key={label}
                  className="flex items-center gap-2 transition-opacity duration-300"
                  style={{ opacity: i <= step ? 1 : 0.25 }}
                >
                  <span className="text-(--color-text)">{i < step ? '✓' : '·'}</span>
                  {label}
                </li>
              ))}
            </ul>
            <span className="font-display text-4xl font-bold text-(--color-text) tabular-nums sm:text-6xl">
              {String(Math.min(Math.round(((step + 1) / STEPS.length) * 100), 100)).padStart(3, '0')}
            </span>
          </div>
          <div className="mt-5 h-px w-full bg-(--color-border)">
            <motion.div
              className="h-px origin-left bg-(--color-text)"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: (STEPS.length * STEP_MS) / 1000, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
