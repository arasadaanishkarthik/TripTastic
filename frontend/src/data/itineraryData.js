export const DEFAULT_ITINERARY = {
  destination: {
    name: 'Kerala',
    region: 'South India',
    tagline: "God's Own Country",
    image: '/assets/images/destinations/kerala.jpg',
    fallback: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1800&q=85',
  },
  dates: {
    start: '2026-10-12',
    end: '2026-10-15',
  },
  durationDays: 4,
  travelers: 4,
  travelerNames: ['Anish', 'Rahul', 'Priya', 'Arjun'],
  budget: {
    total: 24000,
    perPerson: 6000,
    breakdown: [
      { category: 'Accommodation', amount: 7200, color: '#19B5A5' },
      { category: 'Food', amount: 5000, color: '#10B981' },
      { category: 'Transport', amount: 6000, color: '#F59E0B' },
      { category: 'Activities', amount: 4000, color: '#8B5CF6' },
      { category: 'Miscellaneous', amount: 1800, color: '#64748B' },
    ],
  },
  preferences: ['Adventure', 'Nature', 'Food', 'Photography'],
  aiMatch: 92,
  aiReasoning:
    "Your group ranked nature and adventure highest, so the itinerary prioritizes scenic tea plantations and waterfall trails while keeping travel time between locations low.",
  whyDestination:
    'Kerala gives your group a strong balance of misty hill sanctuaries, outdoor trekking, and local culinary trails.',
  days: [
    {
      day: 1,
      title: 'Arrive & Explore',
      activities: [
        { id: 'a1', time: '09:00', title: 'Mountain Breakfast', location: 'Munnar Town', category: 'Food', cost: 250, duration: '1 hour', description: 'Traditional Kerala breakfast with fresh filter coffee.' },
        { id: 'a2', time: '10:30', title: 'Munnar Tea Plantation', location: 'Munnar, Kerala', category: 'Nature', cost: 350, duration: '2 hours', description: 'Walk through endless green rolling hills and misty valleys.' },
        { id: 'a3', time: '13:00', title: 'Spice Valley Lunch', location: 'Devikulam', category: 'Food', cost: 600, duration: '1.5 hours', description: 'Authentic Kerala thali cooked in coconut oil and spices.' },
        { id: 'a4', time: '15:30', title: 'Attukad Waterfalls', location: 'Attukad, Kerala', category: 'Adventure', cost: 100, duration: '2 hours', description: 'Scenic cascade nestled amidst dense jungle hills.' },
        { id: 'a5', time: '18:00', title: 'Pothamedu Viewpoint', location: 'Pothamedu', category: 'Photography', cost: 150, duration: '1 hour', description: 'Panoramic sunset view over the western ghats.' },
      ],
    },
    {
      day: 2,
      title: 'Alpine Trails & Waterfalls',
      activities: [
        { id: 'b1', time: '08:30', title: 'Sunrise Trek', location: 'Meesapulimala Base', category: 'Adventure', cost: 800, duration: '3.5 hours', description: 'Guided morning trek above the cloud line.' },
        { id: 'b2', time: '12:30', title: 'Hilltop Picnic Lunch', location: 'Echo Point', category: 'Food', cost: 400, duration: '1 hour', description: 'Packed local delicacies overlooking the lake.' },
        { id: 'b3', time: '15:00', title: 'Eravikulam National Park', location: 'Rajamalai', category: 'Nature', cost: 500, duration: '2.5 hours', description: 'Spot the endangered Nilgiri Tahr in its natural habitat.' },
      ],
    },
    {
      day: 3,
      title: 'Backwater Escape',
      activities: [
        { id: 'c1', time: '09:00', title: 'Transfer to Alleppey', location: 'Alleppey Ghats', category: 'Transport', cost: 1200, duration: '3 hours', description: 'Scenic drive descending from hills to backwaters.' },
        { id: 'c2', time: '13:00', title: 'Traditional Houseboat Cruise', location: 'Vembanad Lake', category: 'Nature', cost: 2500, duration: '4 hours', description: 'Cruise tranquil palm-fringed canals with onboard lunch.' },
      ],
    },
    {
      day: 4,
      title: 'Heritage & Departure',
      activities: [
        { id: 'd1', time: '09:30', title: 'Fort Kochi Walking Tour', location: 'Fort Kochi', category: 'Culture', cost: 300, duration: '2 hours', description: 'Explore Chinese fishing nets and colonial streets.' },
        { id: 'd2', time: '13:00', title: 'Seafood Farewell Lunch', location: 'Beach Road', category: 'Food', cost: 800, duration: '1.5 hours', description: 'Fresh catch cooked to order.' },
      ],
    },
  ],
};