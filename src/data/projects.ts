export type Domain = 'Robotics' | 'Perception' | 'Robotics AI'

export type Project = {
  slug: string
  title: string
  /** one line, shown on the card */
  summary: string
  dates: string
  context: string
  domains: Domain[]
  /** the case study, in the order an engineer would ask for it */
  problem: string
  approach: string
  result: string
  /** headline outcomes, shown as chips in the modal */
  metrics?: string[]
  tech: string[]
  image: string
  imageAlt: string
  links: { label: string; href: string }[]
}

export const projects: Project[] = [
  {
    slug: 'memflow',
    title: 'AGV Motion Perception',
    summary:
      'A dual-camera optical-flow system that classifies whether an autonomous vehicle is moving or stationary in real time, using MemFlowNet.',
    dates: 'May 2025 – Dec 2025',
    context: 'Real-time motion perception · MemFlowNet on AWS',
    domains: ['Perception', 'Robotics AI'],
    problem:
      'Autonomous tuggers and AGVs on a plant floor need a reliable, camera-only read on whether they are actually moving, so downtime and stoppage events can be logged and analysed without extra sensors on the vehicle.',
    approach:
      'MemFlowNet estimates dense optical flow between consecutive frames on both a front and a rear camera. The mean flow magnitude is thresholded into a MOVING or STATIONARY state, the two camera views are fused into a single decision, and every frame is logged to CSV with a timestamp. Each stream is rendered back out as an annotated video: the RGB frame beside its Middlebury-coloured flow field. Runs on CUDA on AWS.',
    result:
      'Per-frame motion classification in real time with annotated flow visualizations and event logs, giving a clean signal for downtime tracking and motion-event subclassification from cameras alone.',
    metrics: ['Dual-camera', 'MemFlowNet', 'Real-time on AWS'],
    tech: ['PyTorch', 'MemFlowNet', 'OpenCV', 'CUDA', 'AWS'],
    image: '/projects/memflow/hero.gif',
    imageAlt:
      'A warehouse tugger seen from an onboard camera beside its MemFlow optical-flow output, labelled with its motion state',
    links: [],
  },
  {
    slug: 'einsteinvision',
    title: 'EinsteinVision',
    summary:
      'A multi-stage perception pipeline that reconstructs a 3D driving scene from a single forward-facing camera.',
    dates: 'Mar 2025 – Apr 2025',
    context: 'WPI · Deep Learning for Perception',
    domains: ['Perception', 'Robotics AI'],
    problem:
      'Produce a Tesla-style 3D visualization of a driving scene from monocular video: vehicles with heading, lanes, pedestrians, and traffic elements placed in a metric world frame, using a camera that never measures depth directly.',
    approach:
      'A staged pipeline rather than a single model. YOLOv11 and YOLO3D produce oriented 3D vehicle boxes, Detic and Mask R-CNN cover the long tail of traffic elements, RAFT provides dense optical flow, and monocular depth plus human pose estimation supply range and pedestrian state. Detections are lifted into a shared world frame and rendered as a 3D scene in Blender.',
    result:
      'Driving footage reconstructs frame by frame into a clean 3D visualization with lanes, vehicles, pedestrians, traffic lights and signs, closely tracking the source video.',
    metrics: ['Monocular input', '6 model stages', 'Blender scene render'],
    tech: ['PyTorch', 'YOLOv11 / YOLO3D', 'Detic', 'RAFT', 'Blender'],
    image: '/projects/einsteinvision/comparison.gif',
    imageAlt:
      'Side-by-side comparison of the rendered 3D visualization and the real driving footage it was generated from',
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/Prasham2181/EinsteinVision-Tesla-Inspired-Visual-Perception-System',
      },
    ],
  },
  {
    slug: 'sfm',
    title: 'Classical Structure from Motion',
    summary:
      'A complete SfM pipeline implemented from scratch: 3D structure and camera poses recovered from unordered images.',
    dates: 'Feb 2025 – Mar 2025',
    context: 'WPI · Geometric Computer Vision',
    domains: ['Perception'],
    problem:
      'Reconstruct 3D structure and camera motion from a set of unordered 2D photographs, using only the images and the pinhole camera model.',
    approach:
      'RANSAC-filtered feature matching, fundamental and essential matrix estimation, camera pose disambiguation by cheirality, linear and nonlinear triangulation, PnP registration of new views, and global bundle adjustment.',
    result:
      'A consistent 3D point cloud with recovered camera poses, with reprojection error minimised across all registered views.',
    metrics: ['Implemented from scratch', 'Bundle-adjusted'],
    tech: ['Python', 'OpenCV', 'NumPy', 'SciPy'],
    image: '/projects/sfm/hero.png',
    imageAlt: 'Final 3D point cloud reconstruction with camera poses after bundle adjustment',
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/Prasham2181/ClassicalSfM-Pipeline-3D-Reconstruction-from-2D-Images',
      },
    ],
  },
  {
    slug: 'nerf',
    title: 'Neural Radiance Fields',
    summary:
      'Photo-realistic novel-view synthesis from a sparse set of posed images, using a learned volumetric scene representation.',
    dates: 'Mar 2025 – Apr 2025',
    context: 'WPI · Deep Learning for Perception',
    domains: ['Perception', 'Robotics AI'],
    problem:
      'Render a scene from viewpoints that were never photographed, without constructing an explicit mesh or point cloud.',
    approach:
      'An MLP maps 3D position and view direction to volume density and colour. Positional encoding preserves high-frequency detail, and hierarchical volumetric sampling concentrates rays where scene geometry actually lies.',
    result:
      'Novel-view renders of held-out viewpoints, evaluated on PSNR and SSIM against ground truth.',
    metrics: ['PSNR / SSIM evaluated', 'Hierarchical sampling'],
    tech: ['PyTorch', 'NumPy', 'Volumetric rendering'],
    image: '/projects/nerf/hero.gif',
    imageAlt: 'NeRF-rendered turntable view of a synthetic scene',
    links: [{ label: 'GitHub', href: 'https://github.com/Prasham2181/NeRF' }],
  },
  {
    slug: 'autocalib',
    title: 'AutoCalib',
    summary:
      "Camera calibration implemented end to end from Zhang's method, including radial distortion correction.",
    dates: 'Jan 2025 – Feb 2025',
    context: 'WPI · Geometric Computer Vision',
    domains: ['Perception'],
    problem:
      'Every downstream 3D estimate, from triangulation to hand-eye calibration, inherits the accuracy of the camera intrinsics. Those intrinsics have to be recovered from images alone.',
    approach:
      'Automatic checkerboard detection with sub-pixel corner refinement, a closed-form intrinsics estimate from per-view homographies via SVD, then nonlinear optimization of the full model, including radial distortion, by minimising reprojection error.',
    result:
      'Sub-pixel reprojection error and a distortion model that measurably straightens the frame.',
    metrics: ['Sub-pixel reprojection error', 'Radial distortion corrected'],
    tech: ['Python', 'OpenCV', 'SciPy'],
    image: '/projects/autocalib/hero.gif',
    imageAlt: 'Live checkerboard corner detection for camera calibration',
    links: [{ label: 'GitHub', href: 'https://github.com/Prasham2181/AutoCalib-Camera-Calibration' }],
  },
  {
    slug: 'warehouse',
    title: 'Autonomous Warehouse Management System',
    summary:
      'Three sensor-free mobile robots coordinated by overhead vision and a central planner, built for Flipkart Grid 3.0.',
    dates: 'Apr 2021 – Feb 2022',
    context: 'Flipkart Grid 3.0 · National finalist',
    domains: ['Robotics', 'Perception'],
    problem:
      'Route parcels from two induct stations to nine destination chutes across a 7 by 7 ft grid arena, using robots small and low-cost enough that they carry no onboard sensors.',
    approach:
      'Perception is moved off the robot: an overhead arena camera localises every robot from ArUco markers, induct-station cameras read parcel QR codes, and an MQTT-based server maintains world state, plans dynamic shortest paths, and performs real-time collision avoidance.',
    result:
      'Three 6 by 6 in autonomous mobile robots operating continuously in a shared arena, and a national-finalist placement for team CON-SOL-E out of more than 9,000 competing teams.',
    metrics: ['3 AMRs', '9,000+ teams', 'National finalist'],
    tech: ['C++', 'Python', 'ArUco', 'MQTT', 'ESP32 / Arduino'],
    image: '',
    imageAlt: '',
    links: [{ label: 'GitHub', href: 'https://github.com/Prasham2181/Warehouse-Management-System' }],
  },
  {
    slug: 'swarm-robots',
    title: 'Swarm Robots',
    summary:
      'A six-robot centralized swarm holding coordinated formations using onboard odometry and Bluetooth coordination.',
    dates: '2022',
    context: 'ROBOFEST Gujarat 2.0 · State-funded',
    domains: ['Robotics'],
    problem:
      'Maintain coordinated formations across six independent robots in the Microbots category, without an overhead camera or external motion capture.',
    approach:
      'A centralized architecture: commands travel from a mobile app to a master robot, which relays them to five slave robots over Bluetooth LE. Each robot estimates its own pose from wheel encoders and an IMU, with RSSI-assisted positioning to bound drift.',
    result:
      'Coordinated formation movement demonstrated on hardware, supported by a ₹50,000 research grant from the Gujarat state government. Advised by Prof. Harsh Kapadia, Nirma University.',
    metrics: ['6 robots', '₹50,000 grant'],
    tech: ['Arduino Nano 33 BLE', 'Bluetooth LE', 'Multi-agent control'],
    image: '/projects/swarm-robots/hero.png',
    imageAlt: 'One of the swarm robots: a wood-chassis differential-drive bot with an Arduino Nano 33 BLE and battery',
    links: [],
  },
  {
    slug: 'ekf',
    title: 'Extended Kalman Filter',
    summary:
      'Trajectory estimation for a moving vehicle by fusing noisy GPS with drifting odometry.',
    dates: '2024',
    context: 'Project · with Yash Battul',
    domains: ['Robotics AI'],
    problem:
      'GPS is unbiased but noisy; odometry is smooth but accumulates drift. Neither signal alone produces a trajectory accurate enough to act on.',
    approach:
      'An Extended Kalman Filter linearised about the current estimate, propagating the motion model with odometry, correcting with GPS observations, and carrying uncertainty forward through the covariance between updates.',
    result:
      'The fused estimate tracks ground truth more closely than either input across the full run.',
    metrics: ['GPS + odometry fusion'],
    tech: ['MATLAB', 'State estimation'],
    image: '/projects/ekf/hero.png',
    imageAlt:
      'Trajectory plot comparing GPS observations, odometry-only estimate, EKF localization, and ground truth',
    links: [],
  },
  {
    slug: 'autopano',
    title: 'MyAutoPano',
    summary:
      'Panorama stitching solved two ways: a classical homography pipeline and learned homography estimation, compared directly.',
    dates: 'Spring 2025',
    context: 'WPI · Geometric Computer Vision',
    domains: ['Perception', 'Robotics AI'],
    problem:
      'Estimate the homography between overlapping images accurately enough to stitch them seamlessly, and evaluate whether a learned estimator outperforms the classical approach.',
    approach:
      'The classical pipeline runs Harris corner detection, adaptive non-maximal suppression, SIFT descriptors and RANSAC-filtered homography estimation. The learned pipeline trains supervised and unsupervised CNNs to regress homographies directly from image patches.',
    result:
      'Seamless panoramas from the classical pipeline, with the learned models proving faster and more robust on texture-poor overlaps where feature matching degrades.',
    metrics: ['Classical vs learned', 'Supervised + unsupervised'],
    tech: ['Python', 'PyTorch', 'OpenCV', 'RANSAC'],
    image: '/projects/autopano/hero.png',
    imageAlt: 'Panorama stitched from multiple photos using classical homography estimation',
    links: [{ label: 'GitHub', href: 'https://github.com/Prasham2181/My_AutoPano' }],
  },
  {
    slug: 'deepmelody',
    title: 'DeepMelody',
    summary:
      'A music recommender built on learned instrument composition rather than genre labels.',
    dates: '2024',
    context: 'Project',
    domains: ['Robotics AI'],
    problem:
      'Genre labels are a poor proxy for musical similarity. The instrumental character that actually makes two tracks feel alike is buried inside the mix.',
    approach:
      'A U-Net separates individual instrument spectrograms from the Slakh2100 multitrack dataset. Each track is embedded by instrument prominence, and recommendations are drawn from cosine similarity between those embeddings.',
    result:
      'Recommendations that track instrumental character across genre boundaries, driven entirely by learned audio representations.',
    metrics: ['Slakh2100', 'Source separation'],
    tech: ['Python', 'PyTorch', 'U-Net', 'Spectrogram analysis'],
    image: '/projects/deepmelody/hero.gif',
    imageAlt: 'DeepMelody instrument-based music recommendation demo',
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/Prasham2181/DeepMelody-Instrument-Based-Music-Recommendation',
      },
    ],
  },
]

export const domainFilters: Domain[] = ['Robotics', 'Perception', 'Robotics AI']

export const domainColor: Record<Domain, string> = {
  Perception: 'var(--color-perception)',
  Robotics: 'var(--color-robotics)',
  'Robotics AI': 'var(--color-robotics-ai)',
}
