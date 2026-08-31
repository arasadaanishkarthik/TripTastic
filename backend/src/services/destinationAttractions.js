const ATTRACTION_BANK = {
  visakhapatnam: [
    { title: 'Kailasagiri', category: 'Nature', location: 'Kailasagiri Hill Park', description: 'Hilltop park with panoramic views and walking trails over the Bay of Bengal.', time: '09:30', duration: '2 hours', cost: 120, coordinates: { latitude: 17.7748, longitude: 83.3448 } },
    { title: 'RK Beach', category: 'Nature', location: 'Ramakrishna Beach', description: 'Popular seaside promenade for sunset strolls and beach views.', time: '17:00', duration: '1.5 hours', cost: 0, coordinates: { latitude: 17.7205, longitude: 83.3271 } },
    { title: 'Submarine Museum', category: 'Culture', location: 'Beach Road', description: 'Historic decommissioned submarine turned museum and maritime exhibit.', time: '11:00', duration: '1.5 hours', cost: 120, coordinates: { latitude: 17.7140, longitude: 83.3215 } },
    { title: 'Yarada Beach', category: 'Nature', location: 'Yarada', description: 'Scenic crescent-shaped beach with calm waters and great coastal views.', time: '15:00', duration: '2 hours', cost: 0, coordinates: { latitude: 17.6508, longitude: 83.2670 } },
    { title: 'Simhachalam Temple', category: 'Culture', location: 'Simhachalam', description: 'Hilltop temple dedicated to Narasimha with spiritual ambience and city views.', time: '08:30', duration: '1.5 hours', cost: 50, coordinates: { latitude: 17.7600, longitude: 83.2285 } },
    { title: 'Araku Valley', category: 'Adventure', location: 'Araku', description: 'Mountain valley known for coffee plantations, viewpoints, and tribal culture.', time: '09:00', duration: '3 hours', cost: 600, coordinates: { latitude: 18.3266, longitude: 82.8741 } },
    { title: 'Borra Caves', category: 'Adventure', location: 'Ananthagiri Hills', description: 'Stunning limestone caves with natural formations and valley views.', time: '10:30', duration: '2.5 hours', cost: 450, coordinates: { latitude: 18.2186, longitude: 82.9298 } },
  ],
  vizag: [
    { title: 'Kailasagiri', category: 'Nature', location: 'Kailasagiri Hill Park', description: 'Hilltop park with panoramic views and walking trails over the Bay of Bengal.', time: '09:30', duration: '2 hours', cost: 120, coordinates: { latitude: 17.7748, longitude: 83.3448 } },
    { title: 'RK Beach', category: 'Nature', location: 'Ramakrishna Beach', description: 'Popular seaside promenade for sunset strolls and beach views.', time: '17:00', duration: '1.5 hours', cost: 0, coordinates: { latitude: 17.7205, longitude: 83.3271 } },
    { title: 'Submarine Museum', category: 'Culture', location: 'Beach Road', description: 'Historic decommissioned submarine turned museum and maritime exhibit.', time: '11:00', duration: '1.5 hours', cost: 120, coordinates: { latitude: 17.7140, longitude: 83.3215 } },
    { title: 'Yarada Beach', category: 'Nature', location: 'Yarada', description: 'Scenic crescent-shaped beach with calm waters and great coastal views.', time: '15:00', duration: '2 hours', cost: 0, coordinates: { latitude: 17.6508, longitude: 83.2670 } },
    { title: 'Simhachalam Temple', category: 'Culture', location: 'Simhachalam', description: 'Hilltop temple dedicated to Narasimha with spiritual ambience and city views.', time: '08:30', duration: '1.5 hours', cost: 50, coordinates: { latitude: 17.7600, longitude: 83.2285 } },
  ],
  mumbai: [
    { title: 'Gateway of India', category: 'Culture', location: 'Apollo Bunder, Colaba', description: 'Iconic 20th-century arch monument overlooking Mumbai Harbour.', time: '09:30', duration: '1.5 hours', cost: 0, coordinates: { latitude: 18.9220, longitude: 72.8347 } },
    { title: 'Marine Drive & Chowpatty', category: 'Nature', location: 'Netaji Subhash Chandra Bose Road', description: 'Curved coastal promenade known as the Queen’s Necklace, perfect for evening walks.', time: '17:30', duration: '2 hours', cost: 0, coordinates: { latitude: 18.9432, longitude: 72.8230 } },
    { title: 'Elephanta Caves', category: 'Culture', location: 'Gharapuri Island', description: 'UNESCO World Heritage cave temples with rock-cut sculptures of Lord Shiva.', time: '11:00', duration: '3 hours', cost: 260, coordinates: { latitude: 18.9633, longitude: 72.9315 } },
    { title: 'Chhatrapati Shivaji Maharaj Vastu Sangrahalaya', category: 'Culture', location: 'Fort, Mumbai', description: 'Premier art and history museum housed in grand Indo-Saracenic architecture.', time: '14:30', duration: '2 hours', cost: 150, coordinates: { latitude: 18.9269, longitude: 72.8327 } },
    { title: 'Bandra Bandstand & Fort', category: 'Culture', location: 'Bandra West', description: 'Scenic coastal path overlooking the Arabian Sea and historic Castella de Aguada.', time: '16:00', duration: '1.5 hours', cost: 0, coordinates: { latitude: 19.0416, longitude: 72.8184 } },
  ],
  delhi: [
    { title: 'Qutub Minar', category: 'Culture', location: 'Mehrauli', description: '73-meter tall UNESCO-listed victory tower and historic Afghan architecture complex.', time: '09:30', duration: '2 hours', cost: 50, coordinates: { latitude: 28.5245, longitude: 77.1855 } },
    { title: 'Humayun’s Tomb', category: 'Culture', location: 'Nizamuddin East', description: 'Grand Mughal garden tomb that inspired the Taj Mahal architecture.', time: '14:30', duration: '2 hours', cost: 50, coordinates: { latitude: 28.5933, longitude: 77.2507 } },
    { title: 'India Gate & Kartavya Path', category: 'Culture', location: 'Rajpath, Central Delhi', description: 'Prominent war memorial arch surrounded by lush lawns and evening fountains.', time: '17:30', duration: '1.5 hours', cost: 0, coordinates: { latitude: 28.6129, longitude: 77.2295 } },
    { title: 'Red Fort (Lal Qila)', category: 'Culture', location: 'Old Delhi', description: 'Historic 17th-century Mughal fortress in red sandstone.', time: '11:00', duration: '2.5 hours', cost: 50, coordinates: { latitude: 28.6562, longitude: 77.2410 } },
    { title: 'Lodhi Garden', category: 'Nature', location: 'Lodhi Estate', description: 'Picturesque park dotted with 15th-century Sayyid and Lodi architectural tombs.', time: '07:30', duration: '1.5 hours', cost: 0, coordinates: { latitude: 28.5931, longitude: 77.2197 } },
  ],
  jaipur: [
    { title: 'Amber Fort', category: 'Culture', location: 'Amer', description: 'Majestic hilltop fort with artistic Hindu style elements and scenic Maota Lake views.', time: '09:00', duration: '3 hours', cost: 100, coordinates: { latitude: 26.9855, longitude: 75.8513 } },
    { title: 'Hawa Mahal', category: 'Culture', location: 'Badi Choupad', description: 'Palace of Winds with 953 honeycombed windows built in pink sandstone.', time: '13:30', duration: '1 hour', cost: 50, coordinates: { latitude: 26.9239, longitude: 75.8267 } },
    { title: 'City Palace Jaipur', category: 'Culture', location: 'Old City', description: 'Royal residence showcasing a blend of Rajasthani and Mughal architectural heritage.', time: '15:00', duration: '2 hours', cost: 300, coordinates: { latitude: 26.9258, longitude: 75.8237 } },
    { title: 'Nahargarh Fort', category: 'Adventure', location: 'Aravalli Hills', description: 'Hilltop fortress with spectacular sunset panoramas over the entire Pink City.', time: '17:30', duration: '2 hours', cost: 50, coordinates: { latitude: 26.9370, longitude: 75.8156 } },
    { title: 'Jantar Mantar', category: 'Culture', location: 'Gangori Bazaar', description: 'UNESCO-listed astronomical observatory featuring the world’s largest stone sundial.', time: '11:30', duration: '1.5 hours', cost: 50, coordinates: { latitude: 26.9248, longitude: 75.8246 } },
  ],
  amritsar: [
    { title: 'Golden Temple (Harmandir Sahib)', category: 'Culture', location: 'Amritsar Central', description: 'Spiritual epicenter of Sikhism adorned with gold foil and sacred Amrit Sarovar pool.', time: '08:00', duration: '2.5 hours', cost: 0, coordinates: { latitude: 31.6200, longitude: 74.8765 } },
    { title: 'Jallianwala Bagh', category: 'Culture', location: 'Near Golden Temple', description: 'Historic public garden and national memorial of the 1919 massacre.', time: '11:00', duration: '1.5 hours', cost: 0, coordinates: { latitude: 31.6206, longitude: 74.8801 } },
    { title: 'Wagah Border Ceremony', category: 'Culture', location: 'Attari-Wagah Border', description: 'Iconic military lowering-of-the-flags drill and patriotic flag-folding retreat.', time: '16:00', duration: '3 hours', cost: 0, coordinates: { latitude: 31.6046, longitude: 74.5724 } },
    { title: 'Partition Museum', category: 'Culture', location: 'Town Hall', description: 'First museum in the world dedicated to the 1947 partition of India.', time: '13:30', duration: '2 hours', cost: 10, coordinates: { latitude: 31.6247, longitude: 74.8778 } },
  ],
  ooty: [
    { title: 'Ooty Botanical Gardens', category: 'Nature', location: 'Vannarapettai', description: 'Lush 55-acre garden with terraced lawns, exotic flora, and fossil tree trunks.', time: '09:00', duration: '2 hours', cost: 40, coordinates: { latitude: 11.4173, longitude: 76.7118 } },
    { title: 'Doddabetta Peak', category: 'Nature', location: 'Nilgiri Hills', description: 'Highest mountain peak in the Nilgiris with panoramic telescope house views.', time: '11:30', duration: '2 hours', cost: 20, coordinates: { latitude: 11.4007, longitude: 76.7360 } },
    { title: 'Ooty Lake & Boat House', category: 'Adventure', location: 'Ooty West', description: 'Artificial lake surrounded by eucalyptus trees offering pedal and motor boating.', time: '15:00', duration: '2 hours', cost: 150, coordinates: { latitude: 11.4064, longitude: 76.6896 } },
    { title: 'Pykara Waterfalls & Lake', category: 'Nature', location: 'Pykara', description: 'Cascading river falls and tranquil dam lake tucked inside Nilgiri forest.', time: '13:00', duration: '2.5 hours', cost: 60, coordinates: { latitude: 11.5173, longitude: 76.6027 } },
    { title: 'Nilgiri Mountain Railway', category: 'Culture', location: 'Ooty Railway Station', description: 'UNESCO Heritage metre-gauge toy train journey through Nilgiri hills.', time: '08:00', duration: '3 hours', cost: 200, coordinates: { latitude: 11.4042, longitude: 76.6976 } },
  ],
  shimla: [
    { title: 'The Ridge', category: 'Culture', location: 'Mall Road, Shimla', description: 'Spacious open cultural square with panoramic Himalayan vistas and Christ Church.', time: '09:00', duration: '1.5 hours', cost: 0, coordinates: { latitude: 31.1048, longitude: 77.1734 } },
    { title: 'Mall Road', category: 'Shopping', location: 'Shimla Centre', description: 'Pedestrian boulevard lined with local handicraft emporiums, bakeries, and cafes.', time: '17:00', duration: '2 hours', cost: 0, coordinates: { latitude: 31.1033, longitude: 77.1722 } },
    { title: 'Jakhu Temple & Ropeway', category: 'Adventure', location: 'Jakhu Hill', description: 'Highest point in Shimla featuring the 108-foot Hanuman statue and cable car.', time: '11:00', duration: '2.5 hours', cost: 500, coordinates: { latitude: 31.1011, longitude: 77.1856 } },
    { title: 'Viceregal Lodge (IIAS)', category: 'Culture', location: 'Observatory Hill', description: 'Historic Scottish baronial building set amidst manicured English gardens.', time: '14:00', duration: '2 hours', cost: 50, coordinates: { latitude: 31.1039, longitude: 77.1408 } },
    { title: 'Kufri Nature Park', category: 'Nature', location: 'Kufri', description: 'High-altitude nature reserve and adventure zone with Himalayan forest trails.', time: '10:00', duration: '3 hours', cost: 250, coordinates: { latitude: 31.0979, longitude: 77.2678 } },
  ],
  goa: [
    { title: 'Baga Beach', category: 'Nature', location: 'North Goa', description: 'Popular beach for water sports and a lively coastline experience.', time: '09:00', duration: '2.5 hours', cost: 350, coordinates: { latitude: 15.5555, longitude: 73.7511 } },
    { title: 'Fort Aguada', category: 'Culture', location: 'Sinquerim', description: 'Historic Portuguese fort with sea views and a scenic lighthouse.', time: '16:00', duration: '1.5 hours', cost: 50, coordinates: { latitude: 15.4998, longitude: 73.7603 } },
    { title: 'Basilica of Bom Jesus', category: 'Culture', location: 'Old Goa', description: 'UNESCO-listed church known for its baroque architecture and heritage significance.', time: '10:30', duration: '1 hour', cost: 30, coordinates: { latitude: 15.5033, longitude: 73.9118 } },
    { title: 'Palolem Beach', category: 'Nature', location: 'South Goa', description: 'Quiet crescent beach ideal for sunset, swimming, and relaxed coastal evenings.', time: '18:00', duration: '2 hours', cost: 0, coordinates: { latitude: 15.0109, longitude: 74.0283 } },
    { title: 'Dudhsagar Falls', category: 'Adventure', location: 'Mollem National Park', description: 'Tall waterfall surrounded by forest, ideal for nature lovers and photographers.', time: '08:30', duration: '3 hours', cost: 500, coordinates: { latitude: 15.3180, longitude: 74.3280 } },
  ],
  manali: [
    { title: 'Solang Valley', category: 'Adventure', location: 'Solang', description: 'Popular valley for snow activities, paragliding, and mountain views.', time: '09:00', duration: '3 hours', cost: 850, coordinates: { latitude: 32.3397, longitude: 77.1520 } },
    { title: 'Rohtang Pass', category: 'Adventure', location: 'Rohtang', description: 'High mountain pass with dramatic Himalayan scenery and snow vistas.', time: '08:00', duration: '2 hours', cost: 600, coordinates: { latitude: 32.3970, longitude: 77.2460 } },
    { title: 'Hidimba Devi Temple', category: 'Culture', location: 'Old Manali', description: 'Wooden temple set in a forested area, known for its unique architecture.', time: '10:00', duration: '1 hour', cost: 50, coordinates: { latitude: 32.2452, longitude: 77.1888 } },
    { title: 'Mall Road', category: 'Shopping', location: 'Manali Centre', description: 'Main shopping street for souvenirs, local snacks, and mountain-town energy.', time: '18:00', duration: '1.5 hours', cost: 200, coordinates: { latitude: 32.2428, longitude: 77.1867 } },
    { title: 'Vashisht Hot Springs', category: 'Relaxation', location: 'Vashisht', description: 'Natural hot water springs with a peaceful Himalayan ambience.', time: '12:00', duration: '1.5 hours', cost: 100, coordinates: { latitude: 32.2608, longitude: 77.1917 } },
  ],
  kerala: [
    { title: 'Munnar Tea Gardens', category: 'Nature', location: 'Munnar', description: 'Expansive tea estates with misty hills and photo-worthy landscapes.', time: '08:30', duration: '2 hours', cost: 250, coordinates: { latitude: 10.0889, longitude: 77.0595 } },
    { title: 'Mattupetty Dam', category: 'Nature', location: 'Munnar', description: 'Reservoir surrounded by hills and greenery, ideal for scenic viewpoints.', time: '10:30', duration: '1.5 hours', cost: 150, coordinates: { latitude: 10.0957, longitude: 77.0830 } },
    { title: 'Eravikulam National Park', category: 'Nature', location: 'Rajamalai', description: 'Protected high-altitude park famous for the Nilgiri Tahr and sweeping views.', time: '09:00', duration: '2.5 hours', cost: 400, coordinates: { latitude: 10.1983, longitude: 77.0664 } },
    { title: 'Alleppey Backwaters', category: 'Nature', location: 'Alleppey', description: 'Palm-lined waterways and houseboat routes for a serene backwater experience.', time: '13:00', duration: '3 hours', cost: 1000, coordinates: { latitude: 9.4981, longitude: 76.3388 } },
    { title: 'Fort Kochi', category: 'Culture', location: 'Kochi', description: 'Historic waterfront neighborhood with colonial streets and Chinese fishing nets.', time: '16:00', duration: '2 hours', cost: 200, coordinates: { latitude: 9.9660, longitude: 76.2425 } },
    { title: 'Varkala Beach', category: 'Nature', location: 'Varkala', description: 'Cliff-side beach with dramatic views, sunset walks, and a relaxed vibe.', time: '18:00', duration: '2 hours', cost: 0, coordinates: { latitude: 8.7341, longitude: 76.7060 } },
  ],
  munnar: [
    { title: 'Munnar Tea Gardens', category: 'Nature', location: 'Munnar', description: 'Expansive tea estates with misty hills and photo-worthy landscapes.', time: '08:30', duration: '2 hours', cost: 250, coordinates: { latitude: 10.0889, longitude: 77.0595 } },
    { title: 'Mattupetty Dam', category: 'Nature', location: 'Munnar', description: 'Reservoir surrounded by hills and greenery, ideal for scenic viewpoints.', time: '10:30', duration: '1.5 hours', cost: 150, coordinates: { latitude: 10.0957, longitude: 77.0830 } },
    { title: 'Eravikulam National Park', category: 'Nature', location: 'Rajamalai', description: 'Protected high-altitude park famous for the Nilgiri Tahr and sweeping views.', time: '09:00', duration: '2.5 hours', cost: 400, coordinates: { latitude: 10.1983, longitude: 77.0664 } },
  ],
  alleppey: [
    { title: 'Alleppey Backwaters', category: 'Nature', location: 'Alleppey', description: 'Palm-lined waterways and houseboat routes for a serene backwater experience.', time: '13:00', duration: '3 hours', cost: 1000, coordinates: { latitude: 9.4981, longitude: 76.3388 } },
    { title: 'Kuttanad', category: 'Nature', location: 'Alleppey', description: 'Scenic paddy fields and waterways in the heart of Kerala’s backwater region.', time: '10:00', duration: '2 hours', cost: 350, coordinates: { latitude: 9.5655, longitude: 76.3913 } },
  ],
};

function normalizeKey(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ');
}

function getDestinationKey(destinationName) {
  const normalized = normalizeKey(destinationName);
  if (!normalized) return '';
  if (normalized.includes('vizag') || normalized.includes('visakhapatnam')) return 'visakhapatnam';
  if (normalized.includes('mumbai') || normalized.includes('bombay')) return 'mumbai';
  if (normalized.includes('delhi') || normalized.includes('new delhi')) return 'delhi';
  if (normalized.includes('jaipur')) return 'jaipur';
  if (normalized.includes('amritsar')) return 'amritsar';
  if (normalized.includes('ooty') || normalized.includes('udhagamandalam')) return 'ooty';
  if (normalized.includes('shimla') || normalized.includes('simla')) return 'shimla';
  if (normalized.includes('goa')) return 'goa';
  if (normalized.includes('manali')) return 'manali';
  if (normalized.includes('kerala') || normalized.includes('munnar') || normalized.includes('kochi') || normalized.includes('alleppey')) return 'kerala';
  return normalized.split(' ')[0];
}

function pickAttractionsForPreferences(destinationName, preferences = []) {
  const key = getDestinationKey(destinationName);
  const known = ATTRACTION_BANK[key] || [];

  if (!known.length) return [];

  const searched = (preferences || []).map((p) => String(p).toLowerCase());
  const selected = [];

  for (const pref of searched) {
    const matches = known.filter((item) => {
      const category = String(item.category || '').toLowerCase();
      if (pref.includes('food')) return category.includes('culture') || category.includes('food');
      if (pref.includes('nature') || pref.includes('beach')) return category.includes('nature') || category.includes('adventure');
      if (pref.includes('adventure')) return category.includes('adventure') || category.includes('nature');
      if (pref.includes('culture') || pref.includes('heritage')) return category.includes('culture');
      if (pref.includes('shop')) return category.includes('shopping');
      if (pref.includes('relax') || pref.includes('wellness')) return category.includes('relaxation') || category.includes('nature');
      return category.includes('nature') || category.includes('culture');
    });

    if (matches.length) {
      selected.push(...matches.slice(0, 2));
    }
  }

  const deduped = selected.filter((item, index, arr) => arr.findIndex((other) => other.title === item.title) === index);
  if (deduped.length) return deduped.slice(0, 5);
  return known.slice(0, 5);
}

function buildFallbackItinerary(tripData) {
  const destination = tripData.destination || {};
  const name        = destination.name || 'Your Destination';
  const region      = destination.region || destination.state || destination.country || '';
  const country     = destination.country || 'India';
  const groupSize   = Number(tripData.groupSize) || 2;
  const travelers   = Array.isArray(tripData.travelers) && tripData.travelers.length
    ? tripData.travelers
    : Array.from({ length: groupSize }, (_, i) => `Traveler ${i + 1}`);
  const preferences = Array.isArray(tripData.preferences) ? tripData.preferences : ['nature', 'culture'];
  const budgetPerPerson = Number(tripData.budgetPerPerson) || 5000;

  // Calculate the actual requested trip duration (respects durationDays or date range)
  const explicitDays = Number(tripData.durationDays);
  let dayCount = Number.isFinite(explicitDays) && explicitDays > 0 ? explicitDays : 4;
  if (tripData.dates && tripData.dates.start && tripData.dates.end) {
    const diff = Math.round((new Date(tripData.dates.end) - new Date(tripData.dates.start)) / (1000 * 60 * 60 * 24));
    if (diff > 0) dayCount = diff + 1;
  }
  dayCount = Math.max(1, dayCount);

  const knownAttractions = pickAttractionsForPreferences(name, preferences);

  // Meal placeholders added to each day
  const BREAKFAST = {
    category: 'Food', cost: 250, duration: '45 min',
    description: `Start your day with a traditional local breakfast and fresh chai, sampling the regional flavours of ${name}.`,
  };
  const LUNCH = {
    category: 'Food', cost: 450, duration: '1 hour',
    description: `Enjoy a midday meal at a popular local restaurant, trying the regional specialities.`,
  };
  const DINNER = {
    category: 'Food', cost: 700, duration: '1.5 hours',
    description: `Dinner at a well-regarded local restaurant followed by an evening stroll to soak in the local atmosphere.`,
  };

  const days = Array.from({ length: dayCount }, (_, dayIdx) => {
    const acts = [];

    // Breakfast
    acts.push({
      id: `lb-d${dayIdx + 1}-breakfast`,
      time: '08:00',
      title: `Breakfast in ${name}`,
      location: name,
      ...BREAKFAST,
      latitude: destination.latitude || null,
      longitude: destination.longitude || null,
      address: name,
    });

    // Morning POI
    if (knownAttractions.length > 0) {
      const poi = knownAttractions[(dayIdx * 2) % knownAttractions.length];
      acts.push({
        id: `lb-d${dayIdx + 1}-poi1`,
        time: poi.time || '09:30',
        title: poi.title,
        location: poi.location,
        category: poi.category,
        cost: Number(poi.cost) || 200,
        duration: poi.duration || '2 hours',
        description: poi.description,
        latitude: poi.coordinates?.latitude || destination.latitude || null,
        longitude: poi.coordinates?.longitude || destination.longitude || null,
        address: poi.location,
      });
    }

    // Lunch
    acts.push({
      id: `lb-d${dayIdx + 1}-lunch`,
      time: '12:30',
      title: `Lunch — Local Cuisine`,
      location: name,
      ...LUNCH,
      latitude: destination.latitude || null,
      longitude: destination.longitude || null,
      address: name,
    });

    // Afternoon POI
    if (knownAttractions.length > 1) {
      const poi = knownAttractions[(dayIdx * 2 + 1) % knownAttractions.length];
      acts.push({
        id: `lb-d${dayIdx + 1}-poi2`,
        time: poi.time || '14:30',
        title: poi.title,
        location: poi.location,
        category: poi.category,
        cost: Number(poi.cost) || 200,
        duration: poi.duration || '2 hours',
        description: poi.description,
        latitude: poi.coordinates?.latitude || destination.latitude || null,
        longitude: poi.coordinates?.longitude || destination.longitude || null,
        address: poi.location,
      });
    } else if (knownAttractions.length === 0) {
      // Honest fallback when no attractions known
      acts.push({
        id: `lb-d${dayIdx + 1}-explore`,
        time: '14:00',
        title: `Explore ${name}`,
        location: name,
        category: 'Culture',
        cost: 0,
        duration: '2 hours',
        description: `Spend the afternoon exploring local markets, neighbourhoods, and hidden gems of ${name}. No pre-planned route — let curiosity be your guide.`,
        latitude: destination.latitude || null,
        longitude: destination.longitude || null,
        address: name,
      });
    }

    // Dinner
    acts.push({
      id: `lb-d${dayIdx + 1}-dinner`,
      time: '19:30',
      title: `Dinner & Evening`,
      location: name,
      ...DINNER,
      latitude: destination.latitude || null,
      longitude: destination.longitude || null,
      address: name,
    });

    const dayTitle = knownAttractions.length
      ? `Day ${dayIdx + 1}: ${name} Highlights`
      : `Day ${dayIdx + 1}: Discover ${name}`;

    return { day: dayIdx + 1, title: dayTitle, activities: acts };
  });

  return {
    destination: {
      name,
      region,
      tagline: `Explore the best of ${name}`,
      country,
      city:      destination.city  || '',
      state:     destination.state || '',
      latitude:  Number.isFinite(Number(destination.latitude))  ? Number(destination.latitude)  : null,
      longitude: Number.isFinite(Number(destination.longitude)) ? Number(destination.longitude) : null,
      image:     destination.image  || null,
      fallback:  true,
    },
    durationDays:   dayCount,
    travelers:      groupSize,
    travelerNames:  travelers,
    preferences:    preferences.map((p) => String(p).trim()).filter(Boolean),
    aiMatch:        78,
    aiReasoning:    knownAttractions.length
      ? `Fallback itinerary using verified local attractions for ${name}.`
      : `Gemini AI was unavailable and no POIs were returned. Please retry to generate a full AI itinerary.`,
    whyDestination: `Itinerary built from verified ${name} attractions.`,
    budget: {
      total:     budgetPerPerson * groupSize,
      perPerson: budgetPerPerson,
      breakdown: [
        { category: 'Accommodation', amount: Math.round(budgetPerPerson * groupSize * 0.35), color: '#19B5A5' },
        { category: 'Food',          amount: Math.round(budgetPerPerson * groupSize * 0.20), color: '#10B981' },
        { category: 'Transport',     amount: Math.round(budgetPerPerson * groupSize * 0.15), color: '#F59E0B' },
        { category: 'Activities',    amount: Math.round(budgetPerPerson * groupSize * 0.25), color: '#8B5CF6' },
        { category: 'Miscellaneous', amount: Math.round(budgetPerPerson * groupSize * 0.05), color: '#64748B' },
      ],
    },
    days,
  };
}

module.exports = {
  buildFallbackItinerary,
  getDestinationSpecificAttractions: pickAttractionsForPreferences,
};
