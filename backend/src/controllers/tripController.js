// backend/src/controllers/tripController.js
// Trip CRUD — in-memory store (no database dependency).
// Trips are session-scoped and reset when the server restarts.
// The frontend does not call these routes; they are preserved for
// completeness and future use.

let _nextId = 1;
const _trips = new Map();   // id -> trip object
const _members = new Map(); // tripId -> member[]
const _prefs   = new Map(); // tripId -> preferences JSON string

/**
 * POST /api/trips
 */
const createTrip = async (req, res, next) => {
  try {
    const {
      destinationId  = 'goa',
      title          = 'My Trip',
      startDate,
      endDate,
      travelers      = 2,
      budgetPerPerson = 5000,
      totalBudget    = 10000,
      mode           = 'national',
      preferences    = [],
      travelerNames  = [],
    } = req.body;

    const tripId   = _nextId++;
    const now      = new Date().toISOString();
    const trip     = {
      id:               tripId,
      destination_id:   destinationId,
      title,
      start_date:       startDate || null,
      end_date:         endDate   || null,
      travelers,
      budget_per_person: budgetPerPerson,
      total_budget:     totalBudget || (budgetPerPerson * travelers),
      status:           'planned',
      mode,
      created_at:       now,
      updated_at:       now,
    };

    _trips.set(tripId, trip);

    if (preferences && preferences.length > 0) {
      _prefs.set(tripId, JSON.stringify(preferences));
    }

    if (Array.isArray(travelerNames) && travelerNames.length > 0) {
      const memberList = travelerNames
        .filter(n => n && n.trim())
        .map((name, idx) => ({ id: idx + 1, trip_id: tripId, name: name.trim(), role: 'member', created_at: now }));
      _members.set(tripId, memberList);
    }

    res.status(201).json({ success: true, message: 'Trip saved successfully', tripId });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/trips
 */
const listTrips = async (req, res, next) => {
  try {
    const rows = [..._trips.values()]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 50);

    res.json({ success: true, count: rows.length, trips: rows });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/trips/:id
 */
const getTripById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const trip = _trips.get(id);

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    const members = _members.get(id) || [];
    const rawPrefs = _prefs.get(id);
    let preferences = [];
    try { preferences = rawPrefs ? JSON.parse(rawPrefs) : []; } catch {}

    res.json({ success: true, trip: { ...trip, members, preferences } });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/trips/:id
 */
const updateTrip = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const trip = _trips.get(id);

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    const {
      title,
      startDate,
      endDate,
      travelers,
      budgetPerPerson,
      totalBudget,
      status,
      preferences,
    } = req.body;

    const updated = {
      ...trip,
      title:             title            ?? trip.title,
      start_date:        startDate        ?? trip.start_date,
      end_date:          endDate          ?? trip.end_date,
      travelers:         travelers        ?? trip.travelers,
      budget_per_person: budgetPerPerson  ?? trip.budget_per_person,
      total_budget:      totalBudget      ?? trip.total_budget,
      status:            status           ?? trip.status,
      updated_at:        new Date().toISOString(),
    };

    _trips.set(id, updated);

    if (preferences !== undefined) {
      _prefs.set(id, JSON.stringify(preferences));
    }

    res.json({ success: true, message: 'Trip updated successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { createTrip, listTrips, getTripById, updateTrip };
