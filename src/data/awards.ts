export type Award = {
  year: string
  title: string
  detail: string
  href?: string
}

export const awards: Award[] = [
  {
    year: '2022',
    title: 'National Finalist, Flipkart Grid 3.0',
    detail:
      "Led team CON-SOL-E to the national finals of Flipkart's robotics challenge, out of 9,000+ competing teams.",
    href: 'https://github.com/Prasham2181/Warehouse-Management-System',
  },
  {
    year: '2022',
    title: 'Gujarat State Government research grant of ₹50,000',
    detail:
      'Funding awarded for swarm-robotics research in the ROBOFEST Gujarat 2.0 Microbots category.',
  },
]
