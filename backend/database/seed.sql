-- =============================================================================
-- TripTastic — Seed Data for destinations table
-- Run AFTER schema.sql has been applied.
-- Uses INSERT IGNORE so re-running is safe.
-- =============================================================================

USE triptastic;

INSERT IGNORE INTO destinations
  (id, name, city, country, state, region, category, description, travel_type, popular)
VALUES

-- ─── NORTH INDIA ─────────────────────────────────────────────────────────────
('jammu',       'Jammu',        'Jammu',       'India', 'Jammu & Kashmir', 'Northern India',      'culture',   'The City of Temples and gateway to the mountains.',                 'national', 1),
('srinagar',    'Srinagar',     'Srinagar',    'India', 'Jammu & Kashmir', 'Kashmir Valley',      'nature',    'Dal Lake houseboats and Mughal gardens.',                           'national', 1),
('gulmarg',     'Gulmarg',      'Gulmarg',     'India', 'Jammu & Kashmir', 'Himalayas',           'adventure', 'Meadow of flowers and world-class skiing.',                         'national', 0),
('leh',         'Leh',          'Leh',         'India', 'Ladakh',          'Trans-Himalayas',     'mountains', 'High-altitude desert town and ancient Buddhist culture.',           'national', 1),
('ladakh',      'Ladakh',       'Leh',         'India', 'Ladakh',          'Northern Himalayas',  'adventure', 'High passes, starlit valleys, and pristine lakes.',                 'national', 1),
('pangong',     'Pangong Lake', 'Spangmik',    'India', 'Ladakh',          'Trans-Himalayas',     'nature',    'Breathtaking high-altitude changing-colour lake.',                  'national', 0),
('nubra',       'Nubra Valley', 'Diskit',      'India', 'Ladakh',          'Trans-Himalayas',     'adventure', 'Sand dunes, double-humped camels, and monasteries.',               'national', 0),
('manali',      'Manali',       'Manali',      'India', 'Himachal Pradesh','Northern Himalayas',  'mountains', 'Snow-capped peaks, alpine valleys, and adventure sports.',          'national', 1),
('shimla',      'Shimla',       'Shimla',      'India', 'Himachal Pradesh','Northern Himalayas',  'mountains', 'Colonial hill station charm and pine forests.',                     'national', 0),
('spiti',       'Spiti Valley', 'Kaza',        'India', 'Himachal Pradesh','Cold Desert',         'adventure', 'Rugged mountain trails and ancient monasteries.',                   'national', 0),
('dharamshala', 'Dharamshala',  'Dharamshala', 'India', 'Himachal Pradesh','Himalayas',           'culture',   'Serene mountain residence of the Dalai Lama.',                     'national', 0),
('rishikesh',   'Rishikesh',    'Rishikesh',   'India', 'Uttarakhand',     'Himalayas',           'adventure', 'Yoga capital of the world and river rafting hub.',                 'national', 0),
('mussoorie',   'Mussoorie',    'Mussoorie',   'India', 'Uttarakhand',     'Himalayas',           'mountains', 'Queen of the Hills with panoramic Himalayan views.',               'national', 0),
('delhi',       'Delhi',        'New Delhi',   'India', 'Delhi',           'North India',         'culture',   'Historic monuments, street food, and vibrant bazaars.',            'national', 0),
('agra',        'Agra',         'Agra',        'India', 'Uttar Pradesh',   'North India',         'culture',   'Home of the iconic Taj Mahal.',                                    'national', 0),
('varanasi',    'Varanasi',     'Varanasi',    'India', 'Uttar Pradesh',   'North India',         'culture',   'Ancient spiritual capital along the Ganges river.',                'national', 0),

-- ─── NORTHWEST INDIA ─────────────────────────────────────────────────────────
('jaipur',      'Jaipur',       'Jaipur',      'India', 'Rajasthan',       'Northwest India',     'culture',   'The Pink City, royal palaces, and desert forts.',                  'national', 1),
('udaipur',     'Udaipur',      'Udaipur',     'India', 'Rajasthan',       'Northwest India',     'culture',   'City of Lakes, romantic palaces, and royal heritage.',             'national', 0),
('jaisalmer',   'Jaisalmer',    'Jaisalmer',   'India', 'Rajasthan',       'Thar Desert',         'adventure', 'The Golden City and Thar desert safaris.',                         'national', 0),
('jodhpur',     'Jodhpur',      'Jodhpur',     'India', 'Rajasthan',       'Northwest India',     'culture',   'The Blue City with Mehrangarh Fort dominating the skyline.',       'national', 0),
('pushkar',     'Pushkar',      'Pushkar',     'India', 'Rajasthan',       'Northwest India',     'culture',   'Sacred city on the banks of a holy lake.',                         'national', 0),

-- ─── WEST INDIA ──────────────────────────────────────────────────────────────
('goa',         'Goa',          'Panaji',      'India', 'Goa',             'West Coast',          'beaches',   'Sun-drenched golden sands, nightlife, and heritage.',              'national', 1),
('mumbai',      'Mumbai',       'Mumbai',      'India', 'Maharashtra',     'West Coast',          'city',      'The City of Dreams, Bollywood, and coastal energy.',              'national', 0),
('pune',        'Pune',         'Pune',        'India', 'Maharashtra',     'West Coast',          'city',      'The Oxford of the East with a vibrant cafe culture.',             'national', 0),
('aurangabad',  'Aurangabad',   'Aurangabad',  'India', 'Maharashtra',     'Central India',       'culture',   'Gateway to Ajanta and Ellora caves.',                             'national', 0),

-- ─── SOUTH INDIA ─────────────────────────────────────────────────────────────
('kerala',      'Kerala',       'Kochi',       'India', 'Kerala',          'South India',         'nature',    "God's Own Country, backwaters, and lush green hills.",            'national', 1),
('munnar',      'Munnar',       'Munnar',      'India', 'Kerala',          'Western Ghats',       'mountains', 'Misty hills, tea plantations, and scenic landscapes.',            'national', 1),
('wayanad',     'Wayanad',      'Wayanad',     'India', 'Kerala',          'Western Ghats',       'nature',    'Waterfalls, caves, and spice plantations.',                       'national', 0),
('kochi',       'Kochi',        'Kochi',       'India', 'Kerala',          'South India',         'culture',   'Historic port city with colonial architecture.',                  'national', 0),
('alappuzha',   'Alappuzha',    'Alappuzha',   'India', 'Kerala',          'South India',         'nature',    'Venice of the East, famous for houseboat cruises.',               'national', 0),
('varkala',     'Varkala',      'Varkala',     'India', 'Kerala',          'South India',         'beaches',   'Stunning seaside cliffs and pristine beaches.',                   'national', 0),
('thekkady',    'Thekkady',     'Thekkady',    'India', 'Kerala',          'Western Ghats',       'adventure', 'Wildlife sanctuary and elephant sightings.',                      'national', 0),
('vagamon',     'Vagamon',      'Vagamon',     'India', 'Kerala',          'Western Ghats',       'mountains', 'Quiet pine forests and rolling green meadows.',                   'national', 0),
('ooty',        'Ooty',         'Ooty',        'India', 'Tamil Nadu',      'Nilgiri Hills',       'mountains', 'Queen of hill stations with botanical gardens.',                  'national', 0),
('kodaikanal',  'Kodaikanal',   'Kodaikanal',  'India', 'Tamil Nadu',      'Nilgiri Hills',       'mountains', 'Princess of hill stations with misty valleys and star-shaped lake.','national', 0),
('madurai',     'Madurai',      'Madurai',     'India', 'Tamil Nadu',      'South India',         'culture',   'Ancient temple city and cultural heart of Tamil Nadu.',           'national', 0),
('coorg',       'Coorg',        'Madikeri',    'India', 'Karnataka',       'Western Ghats',       'nature',    'Scotland of India, coffee estates, and mist.',                    'national', 0),
('bengaluru',   'Bengaluru',    'Bengaluru',   'India', 'Karnataka',       'South India',         'city',      'The Garden City and vibrant tech metropolis.',                    'national', 0),
('hyderabad',   'Hyderabad',    'Hyderabad',   'India', 'Telangana',       'South India',         'city',      'City of Pearls, historic minarets, and biryani.',                'national', 0),
('chennai',     'Chennai',      'Chennai',     'India', 'Tamil Nadu',      'South India',         'city',      'Cultural capital of South India along the coast.',               'national', 0),
('pondicherry', 'Pondicherry',  'Pondicherry', 'India', 'Puducherry',      'East Coast',          'culture',   'French colonial quarter, promenades, and serenity.',             'national', 0),
('hampi',       'Hampi',        'Hampi',       'India', 'Karnataka',       'Central Karnataka',   'culture',   'UNESCO heritage ruins and boulder-strewn landscapes.',            'national', 0),

-- ─── EAST INDIA ──────────────────────────────────────────────────────────────
('darjeeling',  'Darjeeling',   'Darjeeling',  'India', 'West Bengal',     'Eastern Himalayas',   'mountains', 'World-famous tea gardens and Himalayan train views.',             'national', 0),
('gangtok',     'Gangtok',      'Gangtok',     'India', 'Sikkim',          'Eastern Himalayas',   'mountains', 'Scenic hill resort and gateway to Sikkim peaks.',                 'national', 0),
('kolkata',     'Kolkata',      'Kolkata',     'India', 'West Bengal',     'Eastern India',       'city',      'The City of Joy, art, and colonial heritage.',                    'national', 0),

-- ─── NORTHEAST INDIA ─────────────────────────────────────────────────────────
('meghalaya',   'Meghalaya',    'Shillong',    'India', 'Meghalaya',       'Northeast India',     'nature',    'Abode of clouds, living root bridges, and waterfalls.',           'national', 1),
('shillong',    'Shillong',     'Shillong',    'India', 'Meghalaya',       'Northeast India',     'mountains', 'Scotland of the East and pine-covered hills.',                    'national', 0),
('cherrapunji', 'Cherrapunji',  'Sohra',       'India', 'Meghalaya',       'Northeast India',     'nature',    'Wettest place on earth with dramatic gorges.',                    'national', 0),
('kaziranga',   'Kaziranga',    'Bokakhat',    'India', 'Assam',           'Northeast India',     'adventure', 'UNESCO park home to two-thirds of the world\'s rhinos.',          'national', 0),
('tawang',      'Tawang',       'Tawang',      'India', 'Arunachal Pradesh','Northeast India',    'culture',   'Remote monastery town on the border with Tibet.',                 'national', 0),

-- ─── CENTRAL INDIA ───────────────────────────────────────────────────────────
('khajuraho',   'Khajuraho',    'Khajuraho',   'India', 'Madhya Pradesh',  'Central India',       'culture',   'UNESCO medieval Hindu and Jain temples.',                         'national', 0),
('bhopal',      'Bhopal',       'Bhopal',      'India', 'Madhya Pradesh',  'Central India',       'city',      'City of Lakes with historic mosques and museums.',               'national', 0),
('pench',       'Pench',        'Seoni',       'India', 'Madhya Pradesh',  'Central India',       'adventure', 'Tiger reserve that inspired Kipling\'s Jungle Book.',            'national', 0),

-- ─── ISLANDS ─────────────────────────────────────────────────────────────────
('andaman',     'Andaman Islands','Port Blair', 'India', 'Andaman & Nicobar','Bay of Bengal',    'beaches',   'Turquoise waters, coral reefs, and white sands.',                 'national', 0),
('lakshadweep', 'Lakshadweep',  'Kavaratti',   'India', 'Lakshadweep',     'Arabian Sea',         'beaches',   'Pristine atoll islands with crystal-clear lagoons.',             'national', 0),

-- ─── INTERNATIONAL — ASIA ────────────────────────────────────────────────────
('tokyo',       'Tokyo',        'Tokyo',       'Japan',        'Tokyo',           'East Asia',           'city',      'Neon skyscrapers, temples, and culinary mastery.',           'international', 1),
('kyoto',       'Kyoto',        'Kyoto',       'Japan',        'Kyoto',           'East Asia',           'culture',   'Classical Buddhist temples, gardens, and imperial palaces.', 'international', 0),
('osaka',       'Osaka',        'Osaka',       'Japan',        'Osaka',           'East Asia',           'city',      'Modern architecture, nightlife, and street food culture.',   'international', 0),
('bali',        'Bali',         'Denpasar',    'Indonesia',    'Bali',            'Southeast Asia',      'beaches',   'Tropical paradise, temples, and volcanic peaks.',            'international', 1),
('singapore',   'Singapore',    'Singapore',   'Singapore',    'Singapore',       'Southeast Asia',      'city',      'Futuristic skyline, gardens by the bay, and cuisine.',      'international', 0),
('bangkok',     'Bangkok',      'Bangkok',     'Thailand',     'Bangkok',         'Southeast Asia',      'city',      'Ornate shrines, vibrant street life, and floating markets.','international', 0),
('phuket',      'Phuket',       'Phuket',      'Thailand',     'Phuket',          'Southeast Asia',      'beaches',   'Clear waters, sandy shores, and vibrant resorts.',          'international', 0),
('vietnam',     'Hanoi',        'Hanoi',       'Vietnam',      'Hanoi',           'Southeast Asia',      'culture',   'Ancient quarter, lake-side temples, and street food.',      'international', 0),
('hoi-an',      'Hoi An',       'Hoi An',      'Vietnam',      'Quang Nam',       'Southeast Asia',      'culture',   'Atmospheric ancient trading port with lantern-lit streets.','international', 0),
('nepal',       'Kathmandu',    'Kathmandu',   'Nepal',        'Bagmati',         'South Asia',          'culture',   'Historic temples and gateway to the Himalayas.',            'international', 0),
('pokhara',     'Pokhara',      'Pokhara',     'Nepal',        'Gandaki',         'South Asia',          'mountains', 'Stunning Annapurna views reflected in Phewa Lake.',         'international', 0),
('bhutan',      'Paro',         'Paro',        'Bhutan',       'Paro',            'South Asia',          'culture',   'Pristine Himalayan kingdom of happiness and monasteries.',  'international', 0),
('srilanka',    'Colombo',      'Colombo',     'Sri Lanka',    'Western',         'South Asia',          'culture',   'Teardrop isle of temples, wildlife, and golden beaches.',   'international', 0),

-- ─── INTERNATIONAL — MIDDLE EAST ─────────────────────────────────────────────
('dubai',       'Dubai',        'Dubai',       'UAE',          'Dubai',           'Middle East',         'city',      'Futuristic architecture, luxury shopping, and desert dunes.','international', 1),
('abu-dhabi',   'Abu Dhabi',    'Abu Dhabi',   'UAE',          'Abu Dhabi',       'Middle East',         'culture',   'Magnificent mosques, culture, and coastal islands.',        'international', 0),
('maldives',    'Maldives',     'Malé',        'Maldives',     'Kaafu',           'Indian Ocean',        'beaches',   'Overwater bungalows and crystal-clear turquoise lagoons.',  'international', 1),

-- ─── INTERNATIONAL — EUROPE ──────────────────────────────────────────────────
('paris',       'Paris',        'Paris',       'France',       'Île-de-France',   'Western Europe',      'culture',   'Art, architecture, romance, and world-class dining.',       'international', 1),
('london',      'London',       'London',      'United Kingdom','England',         'Western Europe',      'city',      'Historic landmarks, West End shows, and royal parks.',     'international', 0),
('rome',        'Rome',         'Rome',        'Italy',        'Lazio',           'Southern Europe',     'culture',   'Nearly 3 millennia of globally influential art and architecture.','international', 0),
('venice',      'Venice',       'Venice',      'Italy',        'Veneto',          'Southern Europe',     'culture',   'City of canals, gondolas, and Gothic palaces.',            'international', 0),
('barcelona',   'Barcelona',    'Barcelona',   'Spain',        'Catalonia',       'Southern Europe',     'culture',   'Gaudí architecture, Mediterranean beaches, and tapas.',    'international', 0),
('amsterdam',   'Amsterdam',    'Amsterdam',   'Netherlands',  'North Holland',   'Western Europe',      'city',      'Artistic heritage, elaborate canal systems, and narrow houses.','international', 0),
('switzerland', 'Switzerland',  'Zurich',      'Switzerland',  'Zurich',          'Alps',                'mountains', 'Glaciers, pristine alpine lakes, and scenic train journeys.','international', 1),
('interlaken',  'Interlaken',   'Interlaken',  'Switzerland',  'Bern',            'Alps',                'adventure', 'Traditional resort town nestled between emerald lakes.',   'international', 0),
('iceland',     'Reykjavik',    'Reykjavik',   'Iceland',      'Capital Region',  'Nordic Europe',       'adventure', 'Northern lights, geysers, glaciers, and black sand beaches.','international', 1),
('prague',      'Prague',       'Prague',      'Czech Republic','Prague',          'Central Europe',      'culture',   'Fairy-tale city of Baroque churches and medieval squares.','international', 0),
('santorini',   'Santorini',    'Fira',        'Greece',       'South Aegean',    'Southern Europe',     'beaches',   'Iconic whitewashed cliffs, sunsets, and Aegean beaches.',  'international', 0),

-- ─── INTERNATIONAL — AMERICAS ────────────────────────────────────────────────
('new-york',    'New York',     'New York City','United States','New York',        'North America',       'city',      'The Big Apple, skyscrapers, Broadway, and iconic culture.','international', 0),
('los-angeles', 'Los Angeles',  'Los Angeles', 'United States','California',      'North America',       'city',      'Center of film industry, palm trees, and coastal weather.','international', 0),
('cancun',      'Cancún',       'Cancún',      'Mexico',       'Quintana Roo',    'Central America',     'beaches',   'Crystal Caribbean waters, Mayan ruins, and resorts.',      'international', 0),
('machu-picchu','Machu Picchu', 'Aguas Calientes','Peru',       'Cusco',           'South America',       'culture',   'Legendary Inca citadel in the clouds of the Andes.',       'international', 0),

-- ─── INTERNATIONAL — OCEANIA / AFRICA ────────────────────────────────────────
('sydney',      'Sydney',       'Sydney',      'Australia',    'New South Wales', 'Oceania',             'beaches',   'Harbour city featuring the iconic Opera House and bridge.', 'international', 0),
('new-zealand', 'Queenstown',   'Queenstown',  'New Zealand',  'Otago',           'Oceania',             'adventure', 'Fjords, dramatic alpine peaks, and adventure capital.',    'international', 0),
('cape-town',   'Cape Town',    'Cape Town',   'South Africa', 'Western Cape',    'Southern Africa',     'nature',    'Port city beneath imposing Table Mountain.',              'international', 0);
