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
    role: 'Robotics Intern',
    location: 'Fremont, CA',
    dates: 'Jan 2026 – May 2026',
    logo: '/logos/tesla.png',
    logoScale: 0.78,
    headline: '3D perception and vision-guided manipulation for autonomous pick-and-place.',
    stats: ['±0.2 mm placement accuracy', '>98% first-pass yield', '30+ robots deployed'],
    bullets: [
      'Built a 3D perception and robot-guidance pipeline for autonomous pick-and-place, combining deep-learning object detection, 3D localization, pose estimation and hand-eye calibration to correct robot offsets in real time.',
      'Deployed and validated 30+ FANUC and KUKA robots, covering motion verification, safety-zone validation, interlocks and tool behaviour.',
      'Debugged robot logic, cell interfaces and integration faults during bring-up, improving first-pass commissioning success.',
    ],
    stack: ['Deep learning detection', 'Pose estimation', 'Hand-eye calibration', 'FANUC', 'KUKA'],
  },
  {
    company: 'Rivian',
    role: 'Robotics & Computer Vision Engineering Co-Op',
    location: 'Normal, IL',
    dates: 'May 2025 – Dec 2025',
    logo: '/logos/rivian.png',
    logoScale: 0.86,
    headline: 'Real-time optical-flow motion perception for autonomous vehicles, plus vision-guided manipulation.',
    stats: ['48% faster inference', 'Controls Integration Lead'],
    bullets: [
      'Developed a real-time motion perception system using RAFT and MemFlowNet optical flow (PyTorch, OpenCV, CUDA on AWS) for tugger AGVs, achieving 48% faster inference and enabling automated motion classification, downtime tracking and event subclassification.',
      'Built a vision-guided robotic manipulation pipeline for FANUC arms using Keyence multi-camera systems: 3D object localization, camera-to-robot frame transformations, and motion execution.',
      'Served as Controls Integration Lead for the R2 Front-End Module line, owning controls architecture, PLC and HMI validation, and safety systems.',
    ],
    stack: ['RAFT / MemFlowNet', 'PyTorch', 'CUDA', 'AWS', 'Multi-camera 3D'],
  },
  {
    company: 'Keepsake Automation',
    role: 'Computer Vision & Robotics Integration Intern',
    location: 'Ahmedabad, India',
    dates: 'Feb 2024 – Jun 2024',
    logo: '/logos/keepsake.png',
    logoScale: 1,
    headline: 'Closed-loop vision for autonomous robotic screwing and pick-and-place.',
    stats: ['Closed-loop vision control'],
    bullets: [
      'Developed real-time vision pipelines for object detection and pose-based alignment in Python and OpenCV, enabling autonomous robotic screwing and pick-and-place in a closed-loop system.',
      'Integrated perception output with KUKA robots via Beckhoff TwinCAT and HMI interfaces, coordinating robots, grippers and sensors over EtherCAT and Modbus.',
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
    role: 'Robotics R&D Intern',
    location: 'Ahmedabad, India',
    dates: 'Jan 2023 – May 2023',
    logo: '/logos/icube.jpeg',
    logoScale: 1,
    headline: 'LiDAR SLAM and real-time vehicle tracking for electronic toll collection.',
    stats: ['22% faster processing', '40% lower system cost'],
    bullets: [
      'Developed real-time vehicle tracking algorithms using 2D LiDAR, Hector SLAM and ROS 2, generating bitmap scene representations to compress stored data and extend retention for vehicle profiling.',
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
