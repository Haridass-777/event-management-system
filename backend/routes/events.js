const express = require('express');
const { query } = require('../config/database');

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
  try {
    const eventsQuery = `
      SELECT e.*, c.title as club_name, c.image_url as club_image
      FROM events e
      JOIN clubs c ON e.club_id = c.id
      ORDER BY e.event_date
    `;
    const result = await query(eventsQuery);

    res.json({
      success: true,
      events: result.rows
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events'
    });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const eventQuery = `
      SELECT e.*, c.title as club_name, c.image_url as club_image
      FROM events e
      JOIN clubs c ON e.club_id = c.id
      WHERE e.id = ?
    `;

    const result = await query(eventQuery, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      event: result.rows[0]
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event'
    });
  }
});

// Register for event (for students)
router.post('/:id/register', async (req, res) => {
  try {
    const { id: eventId } = req.params;
    const userId = req.user.id;

    // Check if event exists
    const eventCheck = await query('SELECT id FROM events WHERE id = ?', [eventId]);
    if (eventCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if already registered
    const registrationCheck = await query(
      'SELECT id FROM event_registrations WHERE user_id = ? AND event_id = ?',
      [userId, eventId]
    );

    if (registrationCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Already registered for this event'
      });
    }

    // Add registration
    await query(
      'INSERT INTO event_registrations (user_id, event_id) VALUES (?, ?)',
      [userId, eventId]
    );

    res.json({
      success: true,
      message: 'Successfully registered for the event'
    });
  } catch (error) {
    console.error('Register event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register for event'
    });
  }
});

// Unregister from event (for students)
router.post('/:id/unregister', async (req, res) => {
  try {
    const { id: eventId } = req.params;
    const userId = req.user.id;

    // Remove registration
    const result = await query(
      'DELETE FROM event_registrations WHERE user_id = ? AND event_id = ?',
      [userId, eventId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Not registered for this event'
      });
    }

    res.json({
      success: true,
      message: 'Successfully unregistered from the event'
    });
  } catch (error) {
    console.error('Unregister event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unregister from event'
    });
  }
});

// Get user's event registrations
router.get('/my/registrations', async (req, res) => {
  try {
    const registrationsQuery = `
      SELECT er.*, e.title, e.description, e.event_date, c.title as club_name, c.image_url as club_image
      FROM event_registrations er
      JOIN events e ON er.event_id = e.id
      JOIN clubs c ON e.club_id = c.id
      WHERE er.user_id = ? AND er.status = 'registered'
      ORDER BY e.event_date
    `;

    const result = await query(registrationsQuery, [req.user.id]);

    res.json({
      success: true,
      registrations: result
    });
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registrations'
    });
  }
});

module.exports = router;
