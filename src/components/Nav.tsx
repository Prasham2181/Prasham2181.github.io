import { Mail } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { GithubIcon, LinkedinIcon } from './icons'
import { profile } from '../data/profile'

const links = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#journey' },
  { label: 'Projects', href: '#projects' },
  { label: 'Awards', href: '#recognition' },
  { label: 'Contact', href: '#contact' },
]

const iconLink =
  'rounded-full p-1.5 text-(--color-text-muted) transition-colors hover:text-(--color-brand)'

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-(--color-border) bg-(--color-bg)/85 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-5 py-3.5 sm:px-8">
        <a href="#top" className="shrink-0 text-sm font-semibold tracking-tight text-(--color-text)">
          <span className="sm:hidden">PS</span>
          <span className="hidden sm:inline">Prasham Soni</span>
        </a>
        <nav className="flex items-center gap-3 sm:gap-6">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hidden text-[13px] text-(--color-text-muted) transition-colors hover:text-(--color-text) md:inline"
            >
              {link.label}
            </a>
          ))}
          <div className="flex items-center gap-1 md:border-l md:border-(--color-border) md:pl-4">
            <a href={profile.links.github} target="_blank" rel="noreferrer" aria-label="GitHub" className={iconLink}>
              <GithubIcon size={15} />
            </a>
            <a href={profile.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className={iconLink}>
              <LinkedinIcon size={15} />
            </a>
            <a href={`mailto:${profile.email}`} aria-label="Email" className={iconLink}>
              <Mail size={15} />
            </a>
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  )
}
