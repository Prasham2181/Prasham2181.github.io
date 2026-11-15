export type Domain = 'Robotics' | 'Perception' | 'Robotics AI' | 'Controls'

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
    slug: 'humanoid',
    title: 'Koalby / Ava Humanoid',
    summary:
      'A humanoid that plays physical chess and sorts pills: Stockfish picks the move, a trained detector reads the board, and the arm plans and executes it.',
    dates: '2026',
    context: 'WPI · M.S. capstone',
    domains: ['Robotics', 'Perception', 'Robotics AI'],
    problem:
      'Make the Koalby humanoid manipulate small objects on a table: play a full game of chess against a human or an engine, and pick and sort pills, against a real hardware target whose arm geometry was never designed for it.',
    approach:
      'Stockfish chooses each move; analytic and numerical IK reach the square; every candidate path is swept against known piece poses with keep-out capsules, and any penetration deeper than 5 mm triggers a replan. A YOLO11n detector trained on synthetic top-down renders reads the board from one frame, running out-of-process as a perception service. Spoken or typed commands ("knight to f3") are grounded by an LLM against the legal-move list. Built in Genesis with an independent Isaac Sim port, plus PPO and CEM grasp policies and an RGB-D pill detection pipeline.',
    result:
      'All 64 squares reachable with both arms, and the board read at mAP50 0.986 with 64/64 occupancy and every move of a scripted game recovered from the camera alone. A morphology study showed that re-mounting the claw takes reachability from 57/64 to 64/64, and that moving the board beats adding a wrist servo. A cross-simulator audit found the three arm models agree to 0.001 mm.',
    metrics: ['mAP50 0.986', '64/64 squares', 'Genesis + Isaac Sim'],
    tech: ['Python', 'Genesis', 'Isaac Sim', 'YOLO11', 'PPO', 'Stockfish'],
    image: '/projects/humanoid/hero.webp',
    imageAlt: 'The Koalby humanoid in simulation playing chess at a pedestal board',
    links: [{ label: 'GitHub', href: 'https://github.com/Prasham2181/Kolby_Ava_humanoid' }],
  },
  {
    slug: 'drone-nav',
    title: 'Drone Navigation: EKF, Particle Filter and INS',
    summary:
      'Vision and inertial state estimation for a quadrotor, from AprilTag PnP pose to EKF versus particle-filter fusion, plus a GNSS-aided strapdown INS.',
    dates: 'Fall 2025',
    context: 'WPI · Advanced Robot Navigation',
    domains: ['Robotics AI', 'Perception'],
    problem:
      'Estimate a drone’s full 6-DoF pose from a downward camera over an AprilTag mat and a noisy IMU, and separately keep a MEMS inertial navigation solution from drifting using GNSS, then measure which estimator actually works better.',
    approach:
      'An observation model solves PnP on every frame against a known 12 by 9 tag map and estimates a full 6 by 6 measurement covariance from Vicon residuals. That model feeds a 15-state EKF and a particle filter (250 to 5,000 particles) with IMU propagation and bias states, evaluated on eight trajectories. A third stage implements a strapdown INS in the curvilinear local-level frame with transport-rate and Earth-rate terms, fused with GNSS position, speed and bearing and barometric altitude in an EKF.',
    result:
      'The EKF gave the lowest RMSE on four of the eight trajectories and the particle filter won the other four at high particle counts, a clear accuracy versus compute trade-off. The INS EKF stayed stable across sequences once speed, bearing and barometer updates were added. A UKF variant went numerically unstable, and the report traces why.',
    metrics: ['8 trajectories', 'EKF vs PF', '15-state INS'],
    tech: ['Python', 'NumPy', 'OpenCV', 'EKF', 'Particle filter'],
    image: '/projects/drone-nav/hero.webp',
    imageAlt: '3D trajectory plot of the EKF drone pose estimate against Vicon ground truth',
    links: [],
  },
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
    image: '/projects/memflow/hero.webp',
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
    image: '/projects/einsteinvision/comparison.webp',
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
    image: '/projects/nerf/hero.webp',
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
    image: '/projects/autocalib/hero.webp',
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
    image: '/projects/warehouse/highlight.mp4',
    imageAlt:
      'Overhead view of the 7 by 7 ft grid arena with ArUco-marked mobile robots routing parcels to the nine coloured chutes',
    links: [
      {
        label: 'Watch the full run',
        href: 'https://drive.google.com/file/d/14vDFSUkZIGEMv9P9A_TPrQmJq9Ggz9Bl/view',
      },
      { label: 'GitHub', href: 'https://github.com/Prasham2181/Warehouse-Management-System' },
    ],
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
    image: '/projects/autopano/pipeline.webp',
    imageAlt:
      'The MyAutoPano pipeline cycling through Harris corner detection, RANSAC feature matching, and the final stitched panorama',
    links: [{ label: 'GitHub', href: 'https://github.com/Prasham2181/My_AutoPano' }],
  },
  {
    slug: 'pblite',
    title: 'Probabilistic Boundary Detection',
    summary:
      'pb-lite edge detection from texture, brightness and colour gradients, plus a comparison of CNN backbones from a baseline to ResNeXt and DenseNet.',
    dates: 'Spring 2025',
    context: 'WPI · Computer Vision',
    domains: ['Perception'],
    problem:
      'Classical edge detectors such as Canny and Sobel respond to every intensity change, including texture. Find boundaries that a person would draw, and then see how far architecture choices move a CNN classifier.',
    approach:
      'Oriented derivative-of-Gaussian, Leung-Malik and Gabor filter banks build texton, brightness and colour maps. Half-disc masks turn those into chi-square gradients, which are combined with Sobel and Canny baselines into the pb-lite boundary map. The second phase trains and compares a baseline CNN, batch normalisation, ResNet, ResNeXt and DenseNet on CIFAR-10.',
    result:
      'Cleaner object boundaries than the Canny and Sobel baselines, with texture edges suppressed, and a side-by-side view of how each backbone change affects accuracy and training behaviour.',
    metrics: ['3 filter banks', '5 CNN backbones'],
    tech: ['Python', 'OpenCV', 'PyTorch', 'NumPy'],
    image: '/projects/pblite/hero.webp',
    imageAlt: 'pb-lite boundary map of a butterfly on a flower, edges in white on black',
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/Prasham2181/Alohomora-Probability-based-Edge-Detection',
      },
    ],
  },
  {
    slug: 'deep-vio',
    title: 'Deep Visual-Inertial Odometry',
    summary:
      'Learned inertial, visual and fused odometry for a drone, trained on a synthetic Blender dataset with simulated camera and IMU streams.',
    dates: 'Spring 2025',
    context: 'WPI · Computer Vision · with Sarthak Mehta',
    domains: ['Perception', 'Robotics AI'],
    problem:
      'Estimate a drone’s 6-DoF motion in GPS-denied, low-texture conditions, and test whether end-to-end networks can learn odometry from raw images and IMU data without hand-tuned noise models.',
    approach:
      'A Blender pipeline flies a physics-driven quadrotor over a 100 by 100 m textured plane along nine parametric trajectories, recording a downward camera at 100 Hz and a noisy IMU at 1 kHz with exact ground truth. Three networks predict relative pose between frames: a bidirectional LSTM on IMU windows, an attention-guided CNN on image pairs, and a cross-attention fusion model on both. Rotation is trained with a geodesic loss on SO(3) and translation with L1, with a Bingham loss also tested.',
    result:
      'The inertial-only network had the lowest drift on the synthetic benchmark (mean ATE 0.24 m). The visual and fused models fit their training trajectories but generalised poorly to unseen paths, which pointed to dataset diversity, not architecture, as the limit.',
    metrics: ['Mean ATE 0.24 m (IO)', '9 trajectories', 'Geodesic loss'],
    tech: ['PyTorch', 'Blender', 'LSTM', 'Attention', 'Python'],
    image: '/projects/deep-vio/hero.webp',
    imageAlt: 'A simulated quadrotor with a downward camera flying over a textured city-image plane in Blender',
    links: [],
  },
  {
    slug: 'safeceil',
    title: 'SafeCeil: Radar Fall Detection',
    summary:
      'A ceiling-mounted mmWave radar that detects falls without a camera and alerts staff in under a second.',
    dates: 'Spring 2025',
    context: 'WPI · Directed research · with Brijan Vaghasiya and Eli Breitbart Frischling',
    domains: ['Robotics', 'Perception'],
    problem:
      'In care facilities a resident who falls unseen can wait more than 12 minutes for help. Wearables go unworn, cameras raise privacy concerns and fail in the dark, and pressure mats only cover the bed.',
    approach:
      'One 60 GHz mmWave radar (DFRobot C1001) per room, mounted on the ceiling and read by an ESP32 over UART. Each scan is compared with the last, and a fall is flagged only when a sharp downward motion and a critical body-tilt angle occur together. A fall sounds an on-board buzzer and turns that room red on a control-room dashboard, with the room ID passed on for a humanoid robot to respond.',
    result:
      'Alerts reach the buzzer and dashboard within a second, falls are detected even when the person stays still afterwards, and no camera or microphone is involved. One ceiling unit covers a standard room (11 m range, 100° by 100° field of view).',
    metrics: ['≤ 1 s alert', 'No camera', '60 GHz mmWave'],
    tech: ['ESP32', 'mmWave radar', 'Arduino C++', 'Embedded'],
    image: '/projects/safeceil/hero.webp',
    imageAlt: 'The SafeCeil radar unit mounted on an office ceiling tile next to an air vent',
    links: [],
  },
  {
    slug: 'ik-benchmark',
    title: '6-DOF IK Solver Benchmarking for VR Teleoperation',
    summary:
      'Four inverse kinematics solvers built from scratch and benchmarked inside a VR teleoperation loop, where head motion drives a camera arm.',
    dates: 'Spring 2025',
    context: 'WPI · Graduate group project',
    domains: ['Robotics', 'Controls'],
    problem:
      'A tele-operated humanoid loses sight of its grasp to occlusion. A second, camera-carrying arm can fix that if it follows the operator’s head, but real-time VR control needs an IK solver that is fast, convergent and economical with joint motion, and no benchmarked comparison existed for a 6-DOF arm.',
    approach:
      'Newton-Raphson, Improved Damped Least Squares (with error clamping, manipulability-based damping and joint-limit scaling), SVD-DLS and Particle Swarm Optimization were implemented in MATLAB. A Meta Quest 2 running Unity publishes head pose over the ROS TCP Connector to an Ubuntu host, and a MATLAB ROS node turns pitch and yaw into x-y targets for the non-grasping arm. A benchmark runs all four solvers on identical targets and records computation time, cumulative joint distance and weighted joint-angle change.',
    result:
      'Newton-Raphson was fastest and travelled least in joint space; I-DLS and SVD-DLS made the most conservative joint movements; PSO was slowest and moved most, but was the only solver still producing valid solutions when motion was restricted to yaw alone. I-DLS came out as the best compromise for real-time teleoperation.',
    metrics: ['4 IK solvers', 'Meta Quest 2', 'Unity + ROS + MATLAB'],
    tech: ['MATLAB', 'ROS', 'Unity', 'Meta Quest 2', 'PSO'],
    image: '/projects/ik-benchmark/hero.webp',
    imageAlt:
      'Bar charts comparing completion time, cumulative joint distance and weighted joint-angle change for Newton-Raphson, I-DLS, SVD-DLS and PSO',
    links: [{ label: 'Report', href: '/reports/ik-solver-benchmark.pdf' }],
  },
  {
    slug: 'ros2-arm',
    title: 'Robotic Arm Control: ROS 2',
    summary:
      'Forward and inverse kinematics, velocity-level Jacobian control and a from-scratch PD controller for the OpenManipulator-X, all as ROS 2 nodes on hardware.',
    dates: 'Oct 2024 – Dec 2024',
    context: 'WPI · Foundations of Robotics (RBE 500)',
    domains: ['Robotics', 'Controls'],
    problem:
      'Control a real OpenManipulator-X arm precisely in both joint and Cartesian space, building every layer from the kinematics up rather than relying on the vendor stack.',
    approach:
      'A forward kinematics node subscribes to /joint_states and publishes the end-effector pose from DH parameters; an inverse kinematics service returns joint angles for a requested pose and drives a pick-and-place. Three velocity nodes compute the Jacobian and its Moore-Penrose pseudoinverse, integrate joint velocities and publish a constant twist to move the gripper in a straight Cartesian line. Finally, actuator 4 is switched to current control and regulated by a hand-written PD loop at 100 Hz.',
    result:
      'Straight-line Cartesian motion on the real arm, and a PD controller tuned to Kp = 0.19, Kd = 0.03 that converged quickly with minimal overshoot on all three reference steps (930 to 2000, 2180 to 1500, 930 to 1800 encoder units), logged for 10 s at 100 Hz.',
    metrics: ['PD at 100 Hz', 'Kp 0.19 · Kd 0.03', 'Jacobian pseudoinverse'],
    tech: ['ROS 2', 'Python', 'OpenManipulator-X', 'DYNAMIXEL'],
    image: '/projects/ros2-arm/hero.webp',
    imageAlt: 'The OpenManipulator-X arm holding a red object above a checkerboard on a desk',
    links: [
      { label: 'FK / IK report', href: '/reports/rbe500-fk-ik.pdf' },
      { label: 'Velocity kinematics report', href: '/reports/rbe500-velocity-kinematics.pdf' },
      { label: 'PD controller report', href: '/reports/rbe500-pd-controller.pdf' },
    ],
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
    image: '/projects/deepmelody/hero.webp',
    imageAlt: 'DeepMelody instrument-based music recommendation demo',
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/Prasham2181/DeepMelody-Instrument-Based-Music-Recommendation',
      },
    ],
  },
]

export const domainFilters: Domain[] = ['Robotics', 'Perception', 'Robotics AI', 'Controls']

export const domainColor: Record<Domain, string> = {
  Perception: 'var(--color-perception)',
  Robotics: 'var(--color-robotics)',
  'Robotics AI': 'var(--color-robotics-ai)',
  Controls: 'var(--color-controls)',
}
