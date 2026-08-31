// backend/src/controllers/imageController.js
// Handles destination image requests (Pexels or Unsplash Source).

const images = require('../services/imageService');

/**
 * GET /api/images/destination?q=Kerala&w=1800&h=900
 * Returns a destination image URL + optional attribution metadata.
 */
const getDestinationImage = async (req, res, next) => {
  try {
    const { q, w = 1800, h = 900 } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({ success: false, message: 'Query param "q" is required' });
    }

    const result = await images.getDestinationImage(q.trim());
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/images/status
 * Returns whether the premium image provider (Pexels) is configured.
 */
const getStatus = (req, res) => {
  res.json({
    success:    true,
    configured: images.isConfigured(),
    provider:   images.isConfigured() ? 'pexels' : 'loremflickr',
  });
};

module.exports = { getDestinationImage, getStatus };
