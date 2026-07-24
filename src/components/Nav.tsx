import { useEffect, useState } from 'react'
import { motion, useScroll } from 'framer-motion'
import { Mail, ScanLine } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { GithubIcon, LinkedinIcon } from './icons'
import { profile } from '../data/profile'

const links = [
  { label: 'About', href: '#about', id: 'about', index: '01' },
  { label: 'Journey', href: '#journey', id: 'journey', index: '02' },
  { label: 'Projects', href: '#projects', id: 'projects', index: '03' },
  { label: 'Contact', href: '#contact', id: 'contact', index: '05' },
]

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      // fire when a section crosses the upper-middle band of the viewport
      { rootMargin: '-25% 0px -65% 0px' },
    )
    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(',')])

  return active
}

export function Nav({
  detect,
  onDetect,
}: {
  detect: boolean
  onDetect: (on: boolean) => void
}) {
  const { scrollYProgress } = useScroll()
  const active = useActiveSection(links.map((l) => l.id))

  return (
    <header className="sticky top-0 z-50 border-b border-(--color-border) bg-(--color-bg)/80 backdrop-blur-sm">
      <div className="flex w-full items-center justify-between gap-3 px-4 py-4 sm:px-10">
        {/* the full wordmark plus five links plus the toggle does not fit a 390px bar */}
        <a
          href="#top"
          className="shrink-0 font-mono text-xs font-medium tracking-widest whitespace-nowrap text-(--color-text) uppercase"
        >
          <span className="sm:hidden">PS</span>
          <span className="hidden sm:inline">Prasham Soni</span>
        </a>
        <nav className="flex items-center gap-2.5 sm:gap-6">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`relative font-mono text-[10px] tracking-wide whitespace-nowrap uppercase transition-colors duration-200 sm:text-[11px] sm:tracking-widest ${
                active === link.id
                  ? 'text-(--color-text)'
                  : 'text-(--color-text-muted) hover:text-(--color-text)'
              }`}
            >
              <span className="mr-1.5 hidden tabular-nums opacity-40 sm:inline">{link.index}</span>
              {link.label}
              {active === link.id && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute -bottom-1.5 left-0 h-px w-full bg-(--color-text)"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
            </a>
          ))}
          {/* the site's own claim, run on the site: boxes every element it can find */}
          <button
            type="button"
            onClick={() => onDetect(!detect)}
            aria-pressed={detect}
            title="Run the detector on this page"
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1.5 font-mono text-[10px] tracking-widest uppercase transition-[color,background-color,border-color,scale] duration-200 active:scale-[0.94] sm:px-3 sm:text-[11px] ${
              detect
                ? 'border-(--color-perception) bg-(--color-perception) text-white'
                : 'border-(--color-border) text-(--color-text-muted) hover:border-(--color-text) hover:text-(--color-text)'
            }`}
          >
            <ScanLine size={12} />
            <span className="hidden sm:inline">Detect</span>
          </button>

          <div className="hidden items-center gap-1.5 border-l border-(--color-border) pl-4 sm:flex">
            <a
              href={profile.links.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="rounded-full p-1.5 text-(--color-text-muted) transition-colors hover:text-(--color-text)"
            >
              <GithubIcon size={15} />
            </a>
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="rounded-full p-1.5 text-(--color-text-muted) transition-colors hover:text-(--color-text)"
            >
              <LinkedinIcon size={15} />
            </a>
            <a
              href={`mailto:${profile.email}`}
              aria-label="Email"
              className="rounded-full p-1.5 text-(--color-text-muted) transition-colors hover:text-(--color-text)"
            >
              <Mail size={15} />
            </a>
          </div>
          <ThemeToggle />
        </nav>
      </div>
      {/* reading-progress rail across the three domain colors */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="absolute right-0 bottom-0 left-0 h-0.5 origin-left bg-gradient-to-r from-(--color-perception) via-(--color-robotics) to-(--color-robotics-ai)"
        aria-hidden="true"
      />
    </header>
  )
}
