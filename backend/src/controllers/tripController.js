// backend/src/controllers/tripController.js
// Complete CRUD operations for Trips in MySQL.

const pool = require('../config/db');

/**
 * POST /api/trips
 * Body: { destinationId, title, startDate, endDate, travelers, budgetPerPerson, totalBudget, mode, preferences, travelerNames }
 */
const createTrip = async (req, res, next) => {
  let connection;
  try {
    const {
      destinationId = 'goa',
      title = 'My Trip',
      startDate,
      endDate,
      travelers = 2,
      budgetPerPerson = 5000,
      totalBudget = 10000,
      mode = 'national',
      preferences = [],
      travelerNames = [],
    } = req.body;

    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Check if destination exists in destinations table; if not, use 'goa' or insert
    const [destCheck] = await connection.query(
      'SELECT id FROM destinations WHERE id = ?',
      [destinationId]
    );
    const validDestId = destCheck.length > 0 ? destinationId : 'goa';

    const [tripResult] = await connection.query(
      `INSERT INTO trips
        (destination_id, title, start_date, end_date, travelers, budget_per_person, total_budget, status, mode)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'planned', ?)`,
      [
        validDestId,
        title,
        startDate ? new Date(startDate) : null,
        endDate ? new Date(endDate) : null,
        travelers,
        budgetPerPerson,
        totalBudget || (budgetPerPerson * travelers),
        mode,
      ]
    );

    const tripId = tripResult.insertId;

    // Save preferences
    if (preferences && preferences.length > 0) {
      await connection.query(
        `INSERT INTO trip_preferences (trip_id, interests) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE interests = VALUES(interests)`,
        [tripId, JSON.stringify(preferences)]
      );
    }

    // Save traveler members
    if (Array.isArray(travelerNames) && travelerNames.length > 0) {
      for (const name of travelerNames) {
        if (name && name.trim()) {
          await connection.query(
            `INSERT INTO trip_members (trip_id, name, role) VALUES (?, ?, 'member')`,
            [tripId, name.trim()]
          );
        }
      }
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Trip saved successfully',
      tripId,
    });
  } catch (err) {
    if (connection) await connection.rollback();
    next(err);
  } finally {
    if (connection) connection.release();
  }
};

/**
 * GET /api/trips
 * Returns all saved trips
 */
const listTrips = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT t.*, d.name AS destination_name, d.image_url AS destination_image
       FROM trips t
       LEFT JOIN destinations d ON t.destination_id = d.id
       ORDER BY t.created_at DESC LIMIT 50`
    );

    res.json({
      success: true,
      count: rows.length,
      trips: rows,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/trips/:id
 */
const getTripById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [trips] = await pool.query(
      `SELECT t.*, d.name AS destination_name, d.image_url AS destination_image, d.region
       FROM trips t
       LEFT JOIN destinations d ON t.destination_id = d.id
       WHERE t.id = ?`,
      [id]
    );

    if (trips.length === 0) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    const [members] = await pool.query('SELECT * FROM trip_members WHERE trip_id = ?', [id]);
    const [prefs]   = await pool.query('SELECT * FROM trip_preferences WHERE trip_id = ?', [id]);

    res.json({
      success: true,
      trip: {
        ...trips[0],
        members,
        preferences: prefs[0]?.interests || [],
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/trips/:id
 */
const updateTrip = async (req, res, next) => {
  let connection;
  try {
    const { id } = req.params;
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

    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [existing] = await connection.query('SELECT id FROM trips WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    await connection.query(
      `UPDATE trips
       SET title = COALESCE(?, title),
           start_date = COALESCE(?, start_date),
           end_date = COALESCE(?, end_date),
           travelers = COALESCE(?, travelers),
           budget_per_person = COALESCE(?, budget_per_person),
           total_budget = COALESCE(?, total_budget),
           status = COALESCE(?, status)
       WHERE id = ?`,
      [
        title || null,
        startDate ? new Date(startDate) : null,
        endDate ? new Date(endDate) : null,
        travelers || null,
        budgetPerPerson || null,
        totalBudget || null,
        status || null,
        id,
      ]
    );

    if (preferences) {
      await connection.query(
        `INSERT INTO trip_preferences (trip_id, interests) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE interests = VALUES(interests)`,
        [id, JSON.stringify(preferences)]
      );
    }

    await connection.commit();

    res.json({
      success: true,
      message: 'Trip updated successfully',
    });
  } catch (err) {
    if (connection) await connection.rollback();
    next(err);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  createTrip,
  listTrips,
  getTripById,
  updateTrip,
};
