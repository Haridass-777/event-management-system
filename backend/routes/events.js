const express = require('express');
const { query } = require('../config/database');

const router = express.Router();

// Get all clubs
router.get('/', async (req, res) => {
  try {
    const clubsQuery = 'SELECT * FROM clubs ORDER BY title';
    const result = await query(clubsQuery);

    res.json({
      success: true,
      clubs: result.rows
    });
  } catch (error) {
    console.error('Get clubs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch clubs'
    });
  }
});

// Get club by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const clubQuery = 'SELECT * FROM clubs WHERE id = $1';
    const eventsQuery = 'SELECT * FROM events WHERE club_id = $1 ORDER BY event_date';

    const [clubResult, eventsResult] = await Promise.all([
      query(clubQuery, [id]),
      query(eventsQuery, [id])
    ]);

    if (clubResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }

    res.json({
      success: true,
      club: {
        ...clubResult.rows[0],
        events: eventsResult.rows
      }
    });
  } catch (error) {
    console.error('Get club error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch club'
    });
  }
});

// Join club (for students)
router.post('/:id/join', async (req, res) => {
  try {
    const { id: clubId } = req.params;
    const userId = req.user.id;

    // Check if club exists
    const clubCheck = await query('SELECT id FROM clubs WHERE id = $1', [clubId]);
    if (clubCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }

    // Check if already a member
    const membershipCheck = await query(
      'SELECT id FROM club_memberships WHERE user_id = $1 AND club_id = $2',
      [userId, clubId]
    );

    if (membershipCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Already a member of this club'
      });
    }

    // Add membership
    await query(
      'INSERT INTO club_memberships (user_id, club_id) VALUES ($1, $2)',
      [userId, clubId]
    );

    res.json({
      success: true,
      message: 'Successfully joined the club'
    });
  } catch (error) {
    console.error('Join club error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to join club'
    });
  }
});

// Leave club (for students)
router.post('/:id/leave', async (req, res) => {
  try {
    const { id: clubId } = req.params;
    const userId = req.user.id;

    // Remove membership
    const result = await query(
      'DELETE FROM club_memberships WHERE user_id = $1 AND club_id = $2',
      [userId, clubId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Not a member of this club'
      });
    }

    res.json({
      success: true,
      message: 'Successfully left the club'
    });
  } catch (error) {
    console.error('Leave club error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to leave club'
    });
  }
});

// Get user's club memberships
router.get('/my/memberships', async (req, res) => {
  try {
    const membershipsQuery = `
      SELECT cm.*, c.title, c.description, c.image_url
      FROM club_memberships cm
      JOIN clubs c ON cm.club_id = c.id
      WHERE cm.user_id = $1 AND cm.status = 'active'
      ORDER BY cm.joined_at DESC
    `;

    const result = await query(membershipsQuery, [req.user.id]);

    res.json({
      success: true,
      memberships: result.rows
    });
  } catch (error) {
    console.error('Get memberships error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch memberships'
    });
  }
});

module.exports = router;
