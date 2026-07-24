// The hero's perception feed: six cinematic, free-licence photos (Unsplash, see
// public/perception/CREDITS.md) with hand-placed annotations.
//
// Theme (user-set): perception & robotics engineering: autonomous driving,
// aerial/BEV traffic, UAV navigation, industrial robot cells. Landscape only,
// no identifiable faces.
//
// Coordinates are % of the *image*; PerceptionScene maps them through the
// object-cover crop (honouring each image's `focus` point) so they stay on
// target at any viewport aspect. Regenerate the WebP set + `lqip` values with
// `node scripts/build-perception-images.mjs`.

/** Detector class families. Colours read like a real detection overlay. */
export const classColor = {
  vehicle: '#34d399',
  vru: '#fb7185',
  signal: '#fbbf24',
  structure: '#38bdf8',
  asset: '#c084fc',
} as const

export type ClassFamily = keyof typeof classColor

export type Detection = {
  cls: string
  family: ClassFamily
  conf: number
  x: number
  y: number
  w: number
  h: number
  /** estimated range in metres, rendered like a depth-estimation readout */
  dist?: number
}

export type PerceptionImage = {
  /** basename in public/perception/, e.g. `night-street-1920.webp` */
  name: string
  aspect: number // width / height
  /** the subject, as image %. Drives object-position so crops never behead it. */
  focus: { x: number; y: number }
  task: string
  /** inlined blurred placeholder so the hero never paints empty */
  lqip: string
  detections: Detection[]
}

export const imageWidths = [960, 1440, 1920, 2560]

export const perceptionImages: PerceptionImage[] = [
  {
    name: 'interchange',
    aspect: 1.3333,
    focus: { x: 50, y: 45 },
    task: 'bev_traffic_tracking',
    lqip: 'data:image/webp;base64,UklGRnYAAABXRUJQVlA4IGoAAADQBACdASoYABIAPu1wsFKppiSiqAgBMB2JZQC/OA6+t8d7I9o0HOqEkM4fXo0UAADMJG538IzTFjdmtZ3ZcUtX8exYGVVwlVsoHZHN1fVxVzKGKC0XOViVn7DLqSpXOTpwj93jQVn26EAA',
    detections: [
      { cls: 'bus', family: 'vehicle', conf: 0.97, x: 44.5, y: 34, w: 5.5, h: 4 },
      { cls: 'bus', family: 'vehicle', conf: 0.95, x: 48.5, y: 20, w: 4.5, h: 3.5 },
      { cls: 'car', family: 'vehicle', conf: 0.91, x: 49.5, y: 28.5, w: 3, h: 2.5 },
      { cls: 'car', family: 'vehicle', conf: 0.89, x: 55.5, y: 32, w: 3, h: 2.5 },
      { cls: 'car', family: 'vehicle', conf: 0.87, x: 76.5, y: 28.2, w: 2.6, h: 2.2 },
      { cls: 'truck', family: 'vehicle', conf: 0.93, x: 84, y: 61.5, w: 4.5, h: 3.5 },
      { cls: 'car', family: 'vehicle', conf: 0.9, x: 23, y: 64.5, w: 3.5, h: 2.5 },
      { cls: 'car', family: 'vehicle', conf: 0.88, x: 62, y: 61, w: 3.5, h: 2.5 },
      { cls: 'car', family: 'vehicle', conf: 0.86, x: 45.5, y: 72.5, w: 3.5, h: 2.5 },
    ],
  },
  {
    name: 'night-street',
    aspect: 1.5,
    focus: { x: 62, y: 70 },
    task: 'night_urban_detection',
    lqip: 'data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAADwAwCdASoYABAAPu1iqU2ppaOiMAgBMB2JYwCdAB5VG2iKDVAZlUAAAP7mbcoqGldPakHKuoW+fVouhu7WR8Fn41bfRuEFcvTwAAAA',
    detections: [
      { cls: 'car', family: 'vehicle', conf: 0.97, dist: 8, x: 58.8, y: 62.5, w: 29.6, h: 28 },
      { cls: 'car', family: 'vehicle', conf: 0.96, dist: 14, x: 44.3, y: 64, w: 14.8, h: 20 },
      { cls: 'car', family: 'vehicle', conf: 0.94, dist: 22, x: 26.8, y: 64, w: 8.2, h: 13 },
      { cls: 'car', family: 'vehicle', conf: 0.88, dist: 31, x: 39.6, y: 66, w: 3.8, h: 5 },
      { cls: 'street_light', family: 'signal', conf: 0.84, x: 57.5, y: 56, w: 2.5, h: 5 },
      { cls: 'street_light', family: 'signal', conf: 0.93, x: 8, y: 4, w: 8, h: 9 },
      { cls: 'street_light', family: 'signal', conf: 0.9, x: 61, y: 38.5, w: 5, h: 4.5 },
      { cls: 'drivable_surface', family: 'structure', conf: 0.95, x: 16, y: 72, w: 68, h: 27 },
    ],
  },
  {
    name: 'night-intersection',
    aspect: 1.5,
    focus: { x: 50, y: 50 },
    task: 'signal_intersection',
    lqip: 'data:image/webp;base64,UklGRngAAABXRUJQVlA4IGwAAAAQBACdASoYABAAPu1iqk2ppaQiMAgBMB2JbACdACHhXOS+nI64ka/OoAD+7onAB8sccepNPjpGoiqPc6DDrVWY8AnSIpT+NiLVgXsl7CyvOsznxTf2bUaE1bFU3KzOyq0gkRSdgeKS1/kjMAA=',
    detections: [
      { cls: 'traffic_light', family: 'signal', conf: 0.97, x: 29, y: 25, w: 4, h: 8.5 },
      { cls: 'traffic_light', family: 'signal', conf: 0.95, x: 40.5, y: 24, w: 4, h: 8.5 },
      { cls: 'traffic_light', family: 'signal', conf: 0.91, x: 62, y: 27, w: 4, h: 8.5 },
      { cls: 'traffic_light', family: 'signal', conf: 0.89, x: 79.5, y: 40, w: 4.5, h: 9 },
      { cls: 'pedestrian', family: 'vru', conf: 0.96, dist: 12, x: 91.5, y: 57.5, w: 5.5, h: 17 },
      { cls: 'car', family: 'vehicle', conf: 0.91, dist: 34, x: 5, y: 55, w: 10, h: 9 },
      { cls: 'car', family: 'vehicle', conf: 0.88, dist: 41, x: 19, y: 55.5, w: 9, h: 8 },
      { cls: 'car', family: 'vehicle', conf: 0.85, dist: 47, x: 29, y: 56, w: 8, h: 8 },
      { cls: 'crosswalk', family: 'structure', conf: 0.94, x: 5, y: 63, w: 90, h: 10 },
      { cls: 'street_sign', family: 'signal', conf: 0.87, x: 44, y: 28, w: 6, h: 5 },
    ],
  },
  {
    name: 'robot-arm',
    aspect: 1.5949,
    focus: { x: 40, y: 45 },
    task: 'cell_state_estimation',
    lqip: 'data:image/webp;base64,UklGRoYAAABXRUJQVlA4IHoAAAAQBACdASoYAA8APu1iqU2ppaQiMAgBMB2JQBOmUABoYZF4ARbgUBzxoAD+zzqgw8IHQ/Tb/mXVroZRuvy8/KHprAkRajdwOTr7xHGyAU/XY5iw+ge0Z0MDOGKx6r6dkqxjBabyPwX7LPIm6f/pw2uvJW8E2AzYT3jwAA==',
    detections: [
      { cls: 'robot_arm', family: 'asset', conf: 0.99, dist: 3, x: 17, y: 6, w: 38, h: 71 },
      { cls: 'end_effector', family: 'asset', conf: 0.94, x: 15.4, y: 56, w: 12.6, h: 11.5 },
      { cls: 'press_station', family: 'asset', conf: 0.92, dist: 7, x: 60, y: 32, w: 39, h: 55 },
      { cls: 'station_tag', family: 'signal', conf: 0.96, x: 69, y: 17, w: 6, h: 10 },
      { cls: 'status_beacon', family: 'signal', conf: 0.87, x: 33, y: 33.5, w: 2.8, h: 6.5 },
      { cls: 'cable_carrier', family: 'structure', conf: 0.83, x: 73, y: 30.5, w: 6.3, h: 13.5 },
      { cls: 'conveyor', family: 'structure', conf: 0.89, x: 0, y: 86, w: 58, h: 14 },
    ],
  },
  {
    name: 'cloverleaf',
    aspect: 1.7773,
    focus: { x: 50, y: 50 },
    task: 'hd_map_extraction',
    lqip: 'data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAAAQBACdASoYAA4APu1iqk2ppaQiMAgBMB2JQBOgAx3jdFGqgTcLRrl8QAD+qe3n7WuhSakz8RW+0Rture9O5PHl1WzMr0wRydGtpT0cf48JfZls+wNGRjXZUahHDNwAAAA=',
    detections: [
      { cls: 'loop_ramp', family: 'structure', conf: 0.94, x: 39.5, y: 8.5, w: 20, h: 34 },
      { cls: 'loop_ramp', family: 'structure', conf: 0.92, x: 18, y: 35, w: 19.5, h: 35 },
      { cls: 'loop_ramp', family: 'structure', conf: 0.91, x: 62.5, y: 44, w: 15, h: 30 },
      { cls: 'loop_ramp', family: 'structure', conf: 0.9, x: 41, y: 65, w: 18.5, h: 28 },
      { cls: 'overpass', family: 'structure', conf: 0.96, x: 42, y: 41, w: 26, h: 22 },
    ],
  },
  {
    name: 'quadrotor',
    aspect: 1.5,
    focus: { x: 50, y: 50 },
    task: 'uav_pose_tracking',
    lqip: 'data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAACwAwCdASoYABAAPu1mqk2ppaQiMAgBMB2JZQAAW+o6rj8dsDbWwAD+6Li2Fa9JUGSCcAfpomcsSLF0bD2SA/5IKK3/S32us07UAA==',
    detections: [
      { cls: 'quadrotor', family: 'asset', conf: 0.99, dist: 6, x: 22, y: 30, w: 59, h: 42 },
      { cls: 'gimbal_camera', family: 'asset', conf: 0.97, x: 44, y: 55, w: 12, h: 13 },
      { cls: 'propeller', family: 'structure', conf: 0.93, x: 22, y: 30, w: 18, h: 8 },
      { cls: 'propeller', family: 'structure', conf: 0.91, x: 51, y: 30, w: 30, h: 9 },
      { cls: 'landing_gear', family: 'structure', conf: 0.88, x: 38, y: 45, w: 6, h: 27 },
      { cls: 'landing_gear', family: 'structure', conf: 0.86, x: 57, y: 45, w: 6, h: 27 },
    ],
  },
]
