 export const CLUBS_CONFIG = [
  {
    id: 1,
    title: 'ASTRO CLUB',
    image: '/assets/astroclublogo.jpg',
    contact: 'astro@example.com',     
    description: 'Explore the cosmos and celestial wonders',
  },
  {
    id: 2,
    title: 'AUSEC CLUB',
    image: '/assets/ausec-logo.jpg',
    contact: 'robotics@example.com',
    description: 'Robotics and automation enthusiasts',
  },
  {
    id: 3,
    title: 'CEG TECH FORUM',
    image: '/assets/ceg-tech-forum-logo.jpg',
    contact: 'music@example.com',
    description: 'Technology and innovation discussions',
  },
  {
    id: 4,
    title: 'GUINDY TIMES',
    image: '/assets/guindy-times-club.jpeg',
    contact: 'drama@example.com',
    description: 'News, media and communication',
  },
  {
    id: 5,
    title: 'LEO CLUB',
    image: '/assets/leo-club-logo.jpg',
    contact: 'service@example.com',
    description: 'Community service and leadership',
  },
  {
    id: 6,
    title: 'PIXELS CLUB',
    image: '/assets/pixels-logo.jpg',
    contact: 'coding@example.com',
    description: 'Digital art and design collective',
  },
  {
    id: 7,
    title: 'TWISTERA_CREW CLUB',
    image: '/assets/twistera_crew-logo.jpg',
    contact: 'dance@example.com',
    description: 'Dance and movement arts',
  },
  {
    id: 8,
    title: 'THEATRON CLUB',
    image: '/assets/theatron-logo.jpg',
    contact: 'theatre@example.com',
    description: 'Drama and performing arts',
  }
];

export const EVENTS_CONFIG = [
  {
    id: 1,
    clubId: 1, // link to the club's id from CLUBS_CONFIG
    title: "Annual Fest",
    date: "2024-12-25",
    description: "Our biggest event of the year with fun activities and competitions."
  },
  {
    id: 2,
    clubId: 1,
    title: "Monthly Meetup",
    date: "2024-11-15",
    description: "A casual gathering of club members to discuss ongoing projects."
  },
  {
    id: 3,
    clubId: 2,
    title: "Coding Hackathon",
    date: "2025-01-10",
    description: "24-hour coding challenge open to all club members."
  },
  {
    id: 4,
    clubId: 3,
    title: "Art Exhibition",
    date: "2025-02-05",
    description: "Showcase your art projects and compete for prizes."
  },
  {
    id: 5,
    clubId: 2,
    title: "Tech Talk",
    date: "2024-10-30",
    description: "Guest lecture on latest trends in technology."
  }
];
