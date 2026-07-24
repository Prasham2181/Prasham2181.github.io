import type { CSSProperties } from 'react'
import { profile, skillDomains } from '../data/profile'
import { domainColor } from '../data/projects'
import { Section } from './Section'
import { PerceptionScene } from './PerceptionScene'
import { Rise, Words } from './motion'

export function About() {
  return (
    <Section
      id="about"
      index="01"
      eyebrow="About"
      title="I build robots that can see."
      lede="Robotics and perception engineer working across 3D vision, autonomy, and robot control, with an M.S. in Robotics Engineering from WPI."
    >
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-16">
        <div>
          <Words
            as="p"
            text="My work spans perception and robotics: recovering geometry and semantics from cameras and LiDAR, then turning it into motion a robot can execute, from detection, depth and pose through calibration, planning, and deployment on real hardware."
            className="font-display text-xl leading-snug font-medium text-pretty text-(--color-text) sm:text-2xl"
          />

          <Rise delay={0.15}>
            <p className="mt-6 leading-relaxed text-pretty text-(--color-text-muted)">
              On the perception side I work both the classical, geometric methods (structure from
              motion, camera calibration, SLAM, Kalman filtering) and the learned ones (detection,
              optical flow, monocular depth, neural radiance fields, vision-language models). Most
              real systems need both.
            </p>
          </Rise>

          <Rise delay={0.22}>
            <p className="mt-5 leading-relaxed text-pretty text-(--color-text-muted)">
              On the robotics side I turn those estimates into action: hand-eye calibration, 6-DoF
              pose, motion planning and execution, and multi-robot coordination on FANUC and KUKA
              arms and mobile robots. I have taken this into production at Tesla and Rivian, on
              vision-guided manipulation, real-time motion perception, and robot deployment, which is
              where I learned what breaks between a model and a system.
            </p>
          </Rise>

          <Rise delay={0.3}>
            <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-(--color-border) pt-8 sm:grid-cols-3">
              <div>
                <dt className="font-mono text-[11px] tracking-widest text-(--color-text-muted) uppercase">
                  Focus
                </dt>
                <dd className="mt-2 text-sm text-(--color-text)">
                  Perception, robotics, autonomy
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] tracking-widest text-(--color-text-muted) uppercase">
                  Education
                </dt>
                <dd className="mt-2 text-sm text-(--color-text)">M.S. Robotics, WPI</dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] tracking-widest text-(--color-text-muted) uppercase">
                  Based in
                </dt>
                <dd className="mt-2 text-sm text-(--color-text)">{profile.location}</dd>
              </div>
            </dl>
          </Rise>
        </div>

        {/* the detector runs inside the section that claims I can build one */}
        <Rise delay={0.2} className="lg:sticky lg:top-24 lg:self-start">
          <PerceptionScene aspect="aspect-[4/3]" />
          <p className="mt-3 flex items-start justify-between gap-6 font-mono text-[11px] leading-relaxed text-(--color-text-muted)">
            <span className="max-w-sm">
              Detection and classification on field footage: class, confidence, and range where depth
              is recoverable. Hover to lock an object; it walks its own hits otherwise.
            </span>
            <span className="shrink-0 text-(--color-text)">fig. 01</span>
          </p>
        </Rise>
      </div>

      <div className="mt-24">
        {skillDomains.map(({ domain, blurb, skills }, i) => (
          <Rise key={domain} delay={i * 0.08}>
            <div
              data-detect={`skills.${domain.toLowerCase().replace(' ', '_')}`}
              data-family={i === 0 ? 'vehicle' : i === 1 ? 'signal' : 'asset'}
              className="grid gap-4 border-t border-(--color-border) py-8 md:grid-cols-[16rem_minmax(0,1fr)] md:gap-10"
            >
              <div>
                <p className="flex items-center gap-2.5 font-mono text-xs font-medium tracking-widest uppercase">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: domainColor[domain] }}
                    aria-hidden="true"
                  />
                  <span className="text-(--color-text)">{domain}</span>
                </p>
                <p className="mt-3 max-w-xs text-xs leading-relaxed text-pretty text-(--color-text-muted)">
                  {blurb}
                </p>
              </div>
              <p
                className="flex flex-wrap gap-x-5 gap-y-2 self-start text-sm text-(--color-text-muted)"
                style={{ '--dc': domainColor[domain] } as CSSProperties}
              >
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="cursor-default transition-colors duration-200 hover:text-(--dc)"
                  >
                    {skill}
                  </span>
                ))}
              </p>
            </div>
          </Rise>
        ))}
      </div>

      <Rise delay={0.1}>
        <p className="mt-8 border-t border-(--color-border) pt-7 font-mono text-xs tracking-wide text-(--color-text-muted)">
          Outside work: {profile.interests.map((s) => s.toLowerCase()).join(' · ')}.
        </p>
      </Rise>
    </Section>
  )
}
