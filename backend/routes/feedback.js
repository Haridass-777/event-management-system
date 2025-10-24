/* eslint-env node */
const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/database.js');
const { authenticateToken, requireRole } = require('../middleware/auth.js');
const jwt = require('jsonwebtoken');
const process = require('process');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Submit feedback for an event
router.post('/', [
  authenticateToken,
  requireRole('student'),
  body('eventId').isInt({ min: 1 }),
  body('rating').isInt({ min: 1, max: 5 }),
  body('comments').optional().isLength({ max: 1000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { eventId, rating, comments } = req.body;
    const userId = req.user.id;

    // Check if event exists
    const eventCheck = await query('SELECT id FROM events WHERE id = $1', [eventId]);
    if (eventCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is registered for the event
    const registrationCheck = await query(
      'SELECT id FROM event_registrations WHERE user_id = $1 AND event_id = $2 AND status = $3',
      [userId, eventId, 'registered']
    );

    if (registrationCheck.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'You must be registered for this event to submit feedback'
      });
    }

    // Check if feedback already exists
    const feedbackCheck = await query(
      'SELECT id FROM feedback WHERE user_id = $1 AND event_id = $2',
      [userId, eventId]
    );

    if (feedbackCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'You have already submitted feedback for this event'
      });
    }

    // Insert feedback
    const insertQuery = `
      INSERT INTO feedback (event_id, user_id, rating, comments)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const result = await query(insertQuery, [eventId, userId, rating, comments]);

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      feedback: result.rows[0]
    });

  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback'
    });
  }
});

router.get('/event/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;

    const feedbackQuery = `
      SELECT f.*, u.full_name as user_name
      FROM feedback f
      JOIN users u ON f.user_id = u.id
      WHERE f.event_id = $1
      ORDER BY f.submitted_at DESC
    `;

    const result = await query(feedbackQuery, [eventId]);

    // Calculate average rating
    const totalFeedback = result.rows.length;
    const averageRating = totalFeedback > 0
      ? result.rows.reduce((sum, f) => sum + f.rating, 0) / totalFeedback
      : 0;

    res.json({
      success: true,
      feedback: result.rows,
      summary: {
        totalFeedback,
        averageRating: Math.round(averageRating * 10) / 10
      }
    });

  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback'
    });
  }
});

// Get user's feedback
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const feedbackQuery = `
      SELECT f.*, e.title as event_title, e.event_date, c.title as club_title
      FROM feedback f
      JOIN events e ON f.event_id = e.id
      JOIN clubs c ON e.club_id = c.id
      WHERE f.user_id = $1
      ORDER BY f.submitted_at DESC
    `;

    const result = await query(feedbackQuery, [userId]);

    res.json({
      success: true,
      feedback: result.rows
    });

  } catch (error) {
    console.error('Get user feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your feedback'
    });
  }
});

// Update feedback (if within time limit, e.g., 24 hours)
router.put('/:id', [
  authenticateToken,
  requireRole('student'),
  body('rating').optional().isInt({ min: 1, max: 5 }),
  body('comments').optional().isLength({ max: 1000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { rating, comments } = req.body;
    const userId = req.user.id;

    // Check if feedback exists and belongs to user
    const feedbackCheck = await query(
      'SELECT id, submitted_at FROM feedback WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (feedbackCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    // Check if within 24 hours
    const submittedAt = new Date(feedbackCheck.rows[0].submitted_at);
    const now = new Date();
    const hoursDiff = (now - submittedAt) / (1000 * 60 * 60);

    if (hoursDiff > 24) {
      return res.status(403).json({
        success: false,
        message: 'Feedback can only be edited within 24 hours of submission'
      });
    }

    // Update feedback
    const updateQuery = `
      UPDATE feedback
      SET rating = COALESCE($1, rating), comments = COALESCE($2, comments)
      WHERE id = $3 AND user_id = $4
      RETURNING *
    `;

    const result = await query(updateQuery, [rating, comments, id, userId]);

    res.json({
      success: true,
      message: 'Feedback updated successfully',
      feedback: result.rows[0]
    });

  } catch (error) {
    console.error('Update feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update feedback'
    });
  }
});

// Registration route
router.post('/register', [
  body('email').isEmail().normalizeEmail(),         
  body('password').isLength({ min: 6 }),
  body('fullName').trim().isLength({ min: 1 }),
  body('role').isIn(['student', 'clubhead', 'admin'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }
    const { email, password, fullName, role } = req.body;
    // Check if user already exists
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {   
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);   
    // Insert new user
    const insertQuery = `
      INSERT INTO users (email, password_hash, role, full_name)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, role, full_name  
    `;
    const values = [email, passwordHash, role, fullName];
    const result = await query(insertQuery, values);
    const user = result.rows[0];



    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
    res.status(201).json({
      success: true,
      message: 'User registered successfully',  
      user,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
});

module.exports = router;
