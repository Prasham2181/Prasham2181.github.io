export const profile = {
  name: 'Prasham Soni',
  first: 'PRASHAM',
  last: 'SONI',
  domains: ['Robotics', 'Perception', 'Robotics AI'],
  location: 'Fremont, CA',
  coords: '37.5483 N, 121.9886 W',

  role: 'Robotics & Perception Engineer',
  punchline: 'Perception and control for robots that have to act on what they see.',
  tagline:
    'Perception and robotics, classical and learned: detection, depth, pose, SLAM, and sensor fusion, through motion planning, manipulation, and modern robot learning. Proven on real hardware at Tesla and Rivian, with an M.S. in Robotics Engineering at WPI.',
  status: 'M.S. Robotics Engineering, WPI · Open to full-time roles',

  email: 'soniprasham@gmail.com',
  schoolEmail: 'psoni@wpi.edu',
  links: {
    linkedin: 'https://www.linkedin.com/in/prashamsoni/',
    github: 'https://github.com/Prasham2181',
    scholar: 'https://scholar.google.com/citations?user=sby1CVoAAAAJ',
    instagram: 'https://www.instagram.com/prasham_soni/',
    resume: '/Prasham_Soni_Resume.pdf',
  },
  interests: ['Traveling', 'Volleyball', 'Chess', 'Gaming'],
}

export const education = [
  {
    school: 'Worcester Polytechnic Institute',
    degree: 'M.S., Robotics Engineering',
    location: 'Worcester, MA',
    dates: 'Aug 2024 – Aug 2026',
    gpa: '3.85 / 4.0',
    logo: '/logos/wpi.webp',
    logoScale: 1.35,
    note: 'Geometric computer vision, deep learning for perception, motion planning, state estimation.',
  },
  {
    school: 'Nirma University',
    degree: 'B.Tech., Instrumentation and Control Engineering',
    location: 'Ahmedabad, India',
    dates: 'Aug 2019 – May 2023',
    gpa: '3.23 / 4.0',
    logo: '/logos/nirma.png',
    logoScale: 0.92,
    note: 'Sensors, control systems, and embedded hardware: the foundation the perception work sits on.',
  },
]

export const skillDomains = [
  {
    domain: 'Perception' as const,
    blurb: 'Recovering geometry and semantics from cameras and LiDAR.',
    skills: [
      'PyTorch',
      'OpenCV',
      'CUDA',
      'YOLO / Detic',
      'RAFT optical flow',
      'Monocular depth',
      'NeRF',
      'Structure from motion',
      'Camera calibration',
      'LiDAR / SLAM',
    ],
  },
  {
    domain: 'Robotics' as const,
    blurb: 'Turning a perception output into motion a robot can execute.',
    skills: [
      'ROS 2',
      'Hand-eye calibration',
      'Pose estimation',
      'Motion planning',
      'FANUC',
      'KUKA',
      'Isaac Sim',
      'Gazebo',
      'Multi-robot coordination',
      'Industrial integration',
    ],
  },
  {
    domain: 'Robotics AI' as const,
    blurb: 'The estimation and learning layer underneath both, classical and modern.',
    skills: [
      'Python',
      'C++',
      'Kalman / EKF',
      'Bundle adjustment',
      'Sensor fusion',
      'Deep learning',
      'VLMs',
      'VLAs',
      'Spiking neural networks',
      'AWS',
    ],
  },
]
