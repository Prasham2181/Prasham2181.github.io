import { useEffect, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Journey } from './components/Journey'
import { Projects } from './components/Projects'
import { Recognition } from './components/Recognition'
import { Contact } from './components/Contact'
import { DetectOverlay } from './components/DetectOverlay'
import { Loader } from './components/Loader'
import { Grain } from './components/Grain'
import { useSmoothScroll } from './hooks/useSmoothScroll'

function App() {
  useSmoothScroll()
  const [detect, setDetect] = useState(false)

  // D toggles the detector, Esc always leaves it
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === 'Escape') setDetect(false)
      else if (e.key === 'd' || e.key === 'D') setDetect((v) => !v)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <Loader />
      <Grain />
      <DetectOverlay active={detect} />
      <div className="min-h-screen">
        <Nav detect={detect} onDetect={setDetect} />
        <main>
          <Hero />
          <About />
          <Journey />
          <Projects />
          <Recognition />
          <Contact />
        </main>
        <footer className="flex flex-col gap-4 border-t border-(--color-border) px-5 py-10 font-mono text-xs text-(--color-text-muted) sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <span className="tabular-nums">© {new Date().getFullYear()} Prasham Soni</span>
          <a
            href="#top"
            className="inline-flex items-center gap-2 text-(--color-text) transition-opacity duration-200 hover:opacity-70"
          >
            Back to top <ArrowUp size={13} />
          </a>
        </footer>
      </div>
    </MotionConfig>
  )
}

export default App
