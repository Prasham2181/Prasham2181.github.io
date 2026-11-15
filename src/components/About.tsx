import { profile, skillDomains, toolbox } from '../data/profile'
import { domainColor } from '../data/projects'
import { Section } from './Section'
import { Rise } from './motion'

export function About() {
  return (
    <Section
      id="about"
      eyebrow="About"
      title="I build robots that can see."
      lede="Robotics and perception engineer working across 3D vision, autonomy, and robot control, with an M.S. in Robotics Engineering from WPI."
    >
      <div className="max-w-3xl">
        <div>
          <p className="text-lg leading-snug font-medium text-pretty text-(--color-text) sm:text-xl">
            My work spans perception and robotics: recovering geometry and semantics from cameras and
            LiDAR, then turning it into motion a robot can execute, from detection, depth and pose
            through calibration, planning, and deployment on real hardware.
          </p>

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

      </div>

      <div className="mt-16">
        <Rise>
          <h3 className="mb-5 text-sm font-medium text-(--color-text)">Skills</h3>
        </Rise>
        <ul className="grid gap-4 md:grid-cols-2">
          {skillDomains.map(({ domain, blurb, skills }, i) => (
            <li key={domain}>
              <Rise delay={i * 0.05} className="h-full">
                <div className="h-full rounded-xl border border-(--color-border) bg-(--color-bg-raised) p-5">
                  <p className="flex items-center gap-2 text-sm font-semibold text-(--color-text)">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: domainColor[domain] }}
                      aria-hidden="true"
                    />
                    {domain}
                  </p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-pretty text-(--color-text-muted)">
                    {blurb}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {skills.map((skill) => (
                      <li
                        key={skill}
                        className="rounded-md bg-(--color-accent-soft) px-2 py-1 text-[12px] text-(--color-text)"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </Rise>
            </li>
          ))}
        </ul>

        <Rise delay={0.1}>
          <div className="mt-4 flex flex-col gap-3 rounded-xl border border-(--color-border) p-5 sm:flex-row sm:items-center sm:gap-5">
            <p className="shrink-0 text-sm font-semibold text-(--color-text)">Languages & tools</p>
            <ul className="flex flex-wrap gap-1.5">
              {toolbox.map((tool) => (
                <li
                  key={tool}
                  className="rounded-md border border-(--color-border) px-2 py-1 font-mono text-[11px] text-(--color-text-muted)"
                >
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        </Rise>
      </div>

      <Rise delay={0.1}>
        <p className="mt-8 font-mono text-xs tracking-wide text-(--color-text-muted)">
          Outside work: {profile.interests.map((s) => s.toLowerCase()).join(' · ')}.
        </p>
      </Rise>
    </Section>
  )
}
