import { MotionConfig } from 'framer-motion'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Journey } from './components/Journey'
import { Projects } from './components/Projects'
import { Recognition } from './components/Recognition'
import { Contact } from './components/Contact'

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="page-dots" aria-hidden="true" />
      <div className="min-h-screen">
        <Nav />
        <main>
          <Hero />
          <About />
          <Journey />
          <Projects />
          <Recognition />
          <Contact />
        </main>
        <footer className="mx-auto flex w-full max-w-5xl flex-col gap-2 border-t border-(--color-border) px-5 py-8 font-mono text-xs text-(--color-text-muted) sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span className="tabular-nums">© {new Date().getFullYear()} Prasham Soni</span>
          <a href="#top" className="transition-colors hover:text-(--color-brand)">
            Back to top
          </a>
        </footer>
      </div>
    </MotionConfig>
  )
}

export default App
