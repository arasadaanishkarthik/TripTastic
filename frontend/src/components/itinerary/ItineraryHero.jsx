import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MapPin, Calendar, Users } from 'lucide-react';
import { getDestinationImage } from '../../services/api';

const DESTINATION_FALLBACKS = {
  'goa':           'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1800&q=85',
  'jaipur':        'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1800&q=85',
  'jammu':         'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1800&q=85',
  'kerala':        'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1800&q=85',
  'ladakh':        'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1800&q=85',
  'leh':           'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1800&q=85',
  'manali':        'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1800&q=85',
  'meghalaya':     'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1800&q=85',
  'mumbai':        'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1800&q=85',
  'srinagar':      'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1800&q=85',
  'agra':          'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1800&q=85',
  'alappuzha':     'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1800&q=85',
  'alleppey':      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1800&q=85',
  'munnar':        'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1800&q=85',
  'araku':         'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=85',
  'wayanad':       'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1800&q=85',
  'delhi':         'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1800&q=85',
  'udaipur':       'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1800&q=85',
  'jaisalmer':     'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1800&q=85',
  'rajasthan':     'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1800&q=85',
  'varanasi':      'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1800&q=85',
  'rishikesh':     'https://images.unsplash.com/photo-1600100397608-f010f443a6d4?auto=format&fit=crop&w=1800&q=85',
  'shimla':        'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1800&q=85',
  'spiti':         'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1800&q=85',
  'dharamshala':   'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1800&q=85',
  'gulmarg':       'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1800&q=85',
  'kashmir':       'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1800&q=85',
  'darjeeling':    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1800&q=85',
  'gangtok':       'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1800&q=85',
  'ooty':          'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1800&q=85',
  'coorg':         'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1800&q=85',
  'andaman':       'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1800&q=85',
  'pondicherry':   'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1800&q=85',
  'hyderabad':     'https://images.unsplash.com/photo-1572445271230-a78b5944a659?auto=format&fit=crop&w=1800&q=85',
  'bengaluru':     'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1800&q=85',
  'chennai':       'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1800&q=85',
  'kolkata':       'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1800&q=85',
  'amritsar':      'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=1800&q=85',
  'visakhapatnam': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=85',
  'vizag':         'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=85',
  'vizianagaram':  'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1800&q=85',
  'vzm':           'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1800&q=85',
  'tokyo':         'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1800&q=85',
  'kyoto':         'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1800&q=85',
  'bali':          'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1800&q=85',
  'paris':         'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1800&q=85',
  'dubai':         'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1800&q=85',
  'switzerland':   'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1800&q=85',
  'iceland':       'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1800&q=85',
  'london':        'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1800&q=85',
  'rome':          'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1800&q=85',
  'maldives':      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1800&q=85',
  'default':       'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1800&q=85',
};

function getHeroFallback(name) {
  const lower = (name || '').toLowerCase().trim();
  if (DESTINATION_FALLBACKS[lower]) {
    return DESTINATION_FALLBACKS[lower];
  }
  for (const [key, url] of Object.entries(DESTINATION_FALLBACKS)) {
    if (key !== 'default' && (lower.includes(key) || key.includes(lower))) {
      return url;
    }
  }
  return DESTINATION_FALLBACKS['default'];
}

export const ItineraryHero = ({ itinerary }) => {
  const destName = itinerary?.destination?.name || 'Destination';
  const initialFallback = itinerary?.destination?.fallback || getHeroFallback(destName);

  // Content appears immediately with fallback/initial image, then updates in background
  const [imgSrc, setImgSrc] = useState(itinerary?.destination?.image || initialFallback);
  const [fallback, setFallback] = useState(initialFallback);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    if (!destName) return;
    let cancelled = false;

    getDestinationImage(destName)
      .then((result) => {
        if (!cancelled && result?.url) {
          setImgSrc(result.url);
          setFallback(result.thumbUrl || initialFallback);
        }
      })
      .catch(() => {
        // Retain fallback seamlessly without disruption
      });

    return () => { cancelled = true; };
  }, [destName, initialFallback]);

  // Format dates from itinerary data if available
  const startDate = itinerary.dates?.start;
  const endDate   = itinerary.dates?.end;
  const dateLabel = startDate && endDate
    ? `${new Date(startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} — ${new Date(endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
    : `${itinerary.durationDays || 4} Day Itinerary`;

  return (
    <div className="relative w-full min-h-[260px] xs:min-h-[300px] sm:min-h-[360px] md:min-h-[400px] lg:min-h-[460px] overflow-hidden rounded-3xl bg-[#07111F] shadow-2xl flex flex-col justify-end p-4 xs:p-6 sm:p-8 lg:p-10 select-none">
      {/* Background Image Container with Placeholder */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-gradient-to-br from-[#09182C] via-[#07111F] to-[#040812]">
        <img
          src={imgSrc}
          onError={() => {
            if (imgSrc !== fallback) {
              setImgSrc(fallback);
            }
          }}
          onLoad={() => setImgLoaded(true)}
          alt={`${destName} — ${itinerary.destination?.region || ''}`}
          loading="eager"
          className={`w-full h-full object-cover object-center scale-105 transition-all duration-700 ${
            imgLoaded ? 'opacity-100' : 'opacity-70 blur-xs'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20" />
      </div>

      <div className="relative z-10 space-y-2 sm:space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-primary">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span className="text-[10px] sm:text-[11px] font-semibold tracking-widest uppercase">
            ✦ AI-Planned For Your Group
          </span>
        </div>

        <h1 className="font-heading font-extrabold text-2xl xs:text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight uppercase leading-tight break-words">
          {destName}
        </h1>

        <p className="text-white/80 text-xs sm:text-sm md:text-base font-normal max-w-xl line-clamp-2">
          {itinerary.destination?.tagline || 'Curated Itinerary'} {itinerary.destination?.region ? `— ${itinerary.destination.region}` : ''}
        </p>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2 text-[10px] xs:text-[11px] sm:text-xs text-white/90 font-medium">
          <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md">
            <Calendar className="w-3.5 h-3.5 text-primary shrink-0" /> {dateLabel}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md">
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" /> {itinerary.durationDays || 4} Days
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md">
            <Users className="w-3.5 h-3.5 text-primary shrink-0" /> {itinerary.travelers || 4} Travelers
          </span>
        </div>
      </div>
    </div>
  );
};