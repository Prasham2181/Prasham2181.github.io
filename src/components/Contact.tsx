import { GraduationCap } from 'lucide-react'
import { GithubIcon, InstagramIcon, LinkedinIcon } from './icons'
import { Section } from './Section'
import { Rise, Words } from './motion'
import { profile } from '../data/profile'

const socials = [
  { label: 'LinkedIn', href: profile.links.linkedin, Icon: LinkedinIcon },
  { label: 'GitHub', href: profile.links.github, Icon: GithubIcon },
  { label: 'Scholar', href: profile.links.scholar, Icon: GraduationCap },
  { label: 'Instagram', href: profile.links.instagram, Icon: InstagramIcon },
]

export function Contact() {
  return (
    <Section
      id="contact"
      index="05"
      eyebrow="Contact"
      title="Get in touch"
      lede="Recently completed my M.S. in Robotics Engineering at WPI, and looking for full-time roles in robotics, perception and autonomy."
    >
      <div>
        <Words
          as="p"
          text="Open to conversations about perception, autonomy, and robotics engineering."
          className="max-w-2xl text-lg text-pretty text-(--color-text-muted)"
        />

        {/* the email is the whole call to action, so it gets display scale */}
        <Rise delay={0.1}>
          <a
            href={`mailto:${profile.email}`}
            data-detect="contact.email"
            data-family="signal"
            className="group mt-12 block w-fit max-w-full"
            aria-label={`Email ${profile.email}`}
          >
            <span className="block font-display text-[clamp(1.75rem,6.2vw,5.5rem)] leading-none font-bold tracking-tight break-all text-(--color-text)">
              {profile.email}
            </span>
            <span className="mt-4 block h-px w-full origin-left scale-x-0 bg-(--color-text) transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
          </a>
        </Rise>

        <Rise delay={0.18}>
          <div className="mt-14 flex flex-wrap gap-3">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full border border-(--color-border) px-5 py-3 text-sm text-(--color-text) transition-[border-color,scale] duration-200 hover:border-(--color-text) active:scale-[0.96]"
              >
                <Icon size={15} /> {label}
              </a>
            ))}
          </div>
        </Rise>

        <Rise delay={0.24}>
          <p className="mt-10 font-mono text-xs text-(--color-text-muted)">
            Also at{' '}
            <a
              href={`mailto:${profile.schoolEmail}`}
              className="text-(--color-text) underline-offset-4 hover:underline"
            >
              {profile.schoolEmail}
            </a>{' '}
            · {profile.location}
          </p>
        </Rise>
      </div>
    </Section>
  )
}
