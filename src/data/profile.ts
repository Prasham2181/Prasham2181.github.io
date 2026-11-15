export const profile = {
  name: 'Prasham Soni',
  first: 'PRASHAM',
  last: 'SONI',
  domains: ['Robotics', 'Perception', 'Robotics AI'],
  location: 'Fremont, CA',
  coords: '37.5483 N, 121.9886 W',

  role: 'Robotics & Perception Engineer',
  punchline: 'Making robots slightly less confident and considerably more correct.',
  tagline:
    'Perception and robotics, classical and learned: detection, depth, pose, SLAM, and sensor fusion, through motion planning, manipulation, and modern robot learning. Proven on real hardware at Tesla and Rivian, with an M.S. in Robotics Engineering at WPI.',
  status: 'Robotics & Vision Systems Engineer, Tesla (Optimus Program)',

  email: 'soniprasham@gmail.com',
  schoolEmail: 'psoni@wpi.edu',
  links: {
    linkedin: 'https://www.linkedin.com/in/prashamsoni/',
    github: 'https://github.com/Prasham2181',
    scholar: 'https://scholar.google.com/citations?user=sby1CVoAAAAJ',
    instagram: 'https://www.instagram.com/prasham_soni/',
    resume: '/Prasham_Soni_Resume.pdf?v=2026-11-14',
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
      'Object detection (YOLO, Detic)',
      'Optical flow (RAFT, MemFlowNet)',
      'Monocular depth',
      'NeRF',
      'Structure from motion',
      'Camera calibration',
      'LiDAR SLAM',
      'Keyence / Mech-Mind vision',
      'Defect and inspection imaging',
    ],
  },
  {
    domain: 'Robotics' as const,
    blurb: 'Turning a perception output into motion a robot can execute.',
    skills: [
      'Hand-eye calibration',
      '6-DoF pose estimation',
      'Inverse kinematics',
      'Motion planning',
      'FANUC / KUKA',
      'Multi-robot coordination',
      'Isaac Sim / Genesis / Gazebo',
    ],
  },
  {
    domain: 'Robotics AI' as const,
    blurb: 'The estimation and learning layer underneath both.',
    skills: [
      'Kalman / EKF / particle filters',
      'Sensor fusion',
      'Bundle adjustment',
      'Deep learning',
      'Reinforcement learning (PPO)',
      'VLMs / VLAs',
      'Spiking neural networks',
    ],
  },
  {
    domain: 'Controls' as const,
    blurb: 'Closing the loop on real hardware, from controller design to the industrial stack.',
    skills: [
      'PID / LQR',
      'Torque & servo control',
      'PLC programming',
      'Ignition HMI',
      'EtherCAT / EtherNet/IP',
      'Modbus / OPC UA',
      'ESP32 / Arduino',
    ],
  },
]

/** general-purpose languages and tools, shown once rather than repeated per domain */
export const toolbox = [
  'Python',
  'C++',
  'MATLAB',
  'SQL',
  'ROS 2',
  'PyTorch',
  'OpenCV',
  'CUDA',
  'AWS',
  'FFmpeg',
  'Git',
  'Linux',
]
