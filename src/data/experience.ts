export type ExperienceEntry = {
  company: string
  role: string
  location: string
  dates: string
  logo: string
  /**
   * Logos ship at very different aspect ratios and trim (Keepsake is a 4.8:1
   * wordmark, Tesla a square mark with generous padding baked in). This scales
   * each one so they read at the same optical weight inside the timeline tile.
   */
  logoScale?: number
  /** one line: what the role was for */
  headline: string
  /** measurable outcomes, if there are any worth stating */
  stats?: string[]
  bullets: string[]
  stack: string[]
}

export const experience: ExperienceEntry[] = [
  {
    company: 'Tesla',
    role: 'Robotics & Vision Systems Engineer (Optimus Program)',
    location: 'Fremont, CA',
    dates: 'Aug 2026 – Present',
    logo: '/logos/tesla.png',
    logoScale: 0.78,
    headline: 'Vision data pipelines and station telemetry for Optimus assembly.',
    stats: ['Optimus program', 'Full-time'],
    bullets: [
      'Architected an automated vision data-ingestion pipeline on the Optimus production network using Python and Keyence IV3 cameras over FTP/TCP-IP, capturing high-resolution inspection imagery for automated defect analysis and perception validation.',
      'Engineered a real-time data collection and uptime/downtime telemetry pipeline (L-Metrics) across Optimus assembly stations, streaming high-frequency equipment state and fault events to diagnose bottlenecks and improve cell availability.',
    ],
    stack: ['Python', 'Keyence IV3', 'FTP / TCP-IP', 'Telemetry', 'Defect analysis'],
  },
  {
    company: 'Tesla',
    role: 'Robotics Intern',
    location: 'Fremont, CA',
    dates: 'Jan 2026 – May 2026',
    logo: '/logos/tesla.png',
    logoScale: 0.78,
    headline: 'Robot commissioning and 3D perception for industrial pick-and-place.',
    stats: ['FANUC + KUKA commissioning', 'Mech-Mind 3D vision'],
    bullets: [
      'Executed commissioning and production-readiness validation for FANUC and KUKA robots, performing on-floor robot programming, motion verification, safety checks, and validation of protected-space zones, speed limits, interlocks, and tool behavior to enable safe sign-off and reliable line launch.',
      'Debugged and resolved robot programming and system-integration issues during deployment, improving first-pass commissioning success and reducing bring-up iterations during line launch.',
      'Implemented a Mech-Mind Vision based 3D perception pipeline for robotic pick-and-place, integrating object localization, vision-to-robot calibration, and pose estimation to support accurate industrial material handling.',
    ],
    stack: ['Mech-Mind Vision', 'Pose estimation', 'Vision-to-robot calibration', 'FANUC', 'KUKA'],
  },
  {
    company: 'Rivian',
    role: 'Robotics Software Engineering Co-Op',
    location: 'Normal, IL',
    dates: 'May 2025 – Dec 2025',
    logo: '/logos/rivian.png',
    logoScale: 0.86,
    headline: 'Real-time optical-flow motion perception for autonomous vehicles, plus vision-guided manipulation.',
    stats: ['48% faster inference', 'Controls Integration Lead'],
    bullets: [
      'Developed a real-time RAFT / MemFlowNet-based optical-flow motion perception system (PyTorch, OpenCV, CUDA on AWS) for tuggers and AGVs; achieved 48% faster inference throughput and enabled automated motion classification, downtime tracking, and event-type subclassification for root-cause analysis.',
      'Built a vision-guided robotic manipulation pipeline for FANUC arms using Python and Keyence multi-camera systems; implemented 3D object localization, camera-to-robot frame transformations, and motion execution for precise robotic handling.',
      'Served as Controls Integration Lead for the R2 Front-End Module line, owning controls architecture, PLC and HMI validation, and safety systems.',
    ],
    stack: ['RAFT / MemFlowNet', 'PyTorch', 'CUDA', 'AWS', 'FANUC', 'Keyence vision'],
  },
  {
    company: 'Keepsake Automation',
    role: 'Intern',
    location: 'Ahmedabad, India',
    dates: 'Feb 2024 – Jun 2024',
    logo: '/logos/keepsake.png',
    logoScale: 1,
    headline: 'Closed-loop vision for autonomous robotic screwing and pick-and-place.',
    stats: ['Closed-loop vision control'],
    bullets: [
      'Developed real-time vision pipelines for object detection and pose-based alignment in Python and OpenCV, enabling autonomous robotic screwing and pick-and-place in a closed-loop system.',
      'Integrated perception outputs with KUKA robots through Beckhoff TwinCAT (Ladder/ST) to support synchronized vision-guided motion and process execution.',
    ],
    stack: ['OpenCV', 'Pose alignment', 'KUKA', 'TwinCAT', 'EtherCAT'],
  },
  {
    company: 'Reliance Industries',
    role: 'Graduate Engineer Trainee',
    location: 'Jamnagar, India',
    dates: 'Aug 2023 – Feb 2024',
    logo: '/logos/reliance.png',
    logoScale: 1.35,
    headline: 'Instrumentation and control design for large-scale energy projects.',
    bullets: [
      'Produced instrumentation and control design deliverables within the Project Management Group (C&I): P&ID creation, instrument commissioning and field verification for oil and gas projects.',
    ],
    stack: ['Instrumentation', 'P&ID', 'Control systems'],
  },
  {
    company: 'ICUBE Technologies',
    role: 'Robotics Research and Development Intern',
    location: 'Ahmedabad, India',
    dates: 'Jan 2023 – May 2023',
    logo: '/logos/icube.jpeg',
    logoScale: 1,
    headline: 'LiDAR SLAM and real-time vehicle tracking for electronic toll collection.',
    stats: ['22% faster processing', '40% lower system cost'],
    bullets: [
      'Developed real-time vehicle tracking algorithms using Hector SLAM and ROS 2, generating bitmap-based scene representations to optimize storage, reduce data size, and extend retention for toll collection and vehicle profiling systems.',
      'Optimized the sensor configuration and processing chain, cutting toll processing time by 22% and system cost by 40%.',
    ],
    stack: ['2D LiDAR', 'Hector SLAM', 'ROS 2', 'Vehicle tracking'],
  },
  {
    company: 'Nutron Systems',
    role: 'Robotics R&D Intern',
    location: 'Ahmedabad, India',
    dates: 'Jun 2022 – Jul 2022',
    logo: '/logos/nutron.png',
    logoScale: 1.25,
    headline: 'Cloud-connected control systems and digital-twin fundamentals.',
    bullets: [
      'Integrated a heterogeneous manufacturing control system with AWS, working across LabVIEW, digital-twin, IIoT and automation concepts.',
    ],
    stack: ['LabVIEW', 'AWS', 'Digital twin'],
  },
]
