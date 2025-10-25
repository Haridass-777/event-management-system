const express = require('express');
const multer = require('multer');
const path = require('path');
const { query } = require('../config/database.js');
const { authenticateToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880 }, // 5MB default
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Get all announcements
router.get('/', async (req, res) => {
  try {
    const announcementsQuery = `
      SELECT a.*, c.title as club_title, u.full_name as creator_name
      FROM announcements a
      JOIN clubs c ON a.club_id = c.id
      JOIN users u ON a.created_by = u.id
      ORDER BY a.created_at DESC
    `;

    const result = await query(announcementsQuery);

    res.json({
      success: true,
      announcements: result.rows
    });
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch announcements'
    });
  }
});

// Get announcement by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const announcementQuery = `
      SELECT a.*, c.title as club_title, u.full_name as creator_name
      FROM announcements a
      JOIN clubs c ON a.club_id = c.id
      JOIN users u ON a.created_by = u.id
      WHERE a.id = ?
    `;

    const result = await query(announcementQuery, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    res.json({
      success: true,
      announcement: result.rows[0]
    });
  } catch (error) {
    console.error('Get announcement error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch announcement'
    });
  }
});

// Get announcements by club
router.get('/club/:clubId', async (req, res) => {
  try {
    const { clubId } = req.params;
    const announcementsQuery = `
      SELECT a.*, u.full_name as creator_name
      FROM announcements a
      JOIN users u ON a.created_by = u.id
      WHERE a.club_id = ?
      ORDER BY a.created_at DESC
    `;

    const result = await query(announcementsQuery, [clubId]);

    res.json({
      success: true,
      announcements: result
    });
  } catch (error) {
    console.error('Get club announcements error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch club announcements'
    });
  }
});

// Create new announcement (club heads only)
router.post('/', authenticateToken, requireRole('clubhead'), upload.single('poster'), async (req, res) => {
  try {
    const { title, description, date, clubId } = req.body;
    const userId = req.user.id;
    const posterUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // Verify user is club head of the specified club
    if (req.user.club_id !== parseInt(clubId)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create announcements for this club'
      });
    }

    const insertQuery = `
      INSERT INTO announcements (title, description, announcement_date, club_id, poster_url, created_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [title, description, date, clubId, posterUrl, userId];
    const result = await query(insertQuery, values);

    // Get the inserted announcement
    const selectQuery = 'SELECT * FROM announcements WHERE id = LAST_INSERT_ID()';
    const announcementResult = await query(selectQuery);

    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      announcement: announcementResult
    });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create announcement'
    });
  }
});

// Update announcement (club heads only)
router.put('/:id', authenticateToken, requireRole('clubhead'), upload.single('poster'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date } = req.body;
    const userId = req.user.id;
    const posterUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // Check if announcement exists and user owns it
    const checkQuery = 'SELECT club_id FROM announcements WHERE id = ? AND created_by = ?';
    const checkResult = await query(checkQuery, [id, userId]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found or not authorized'
      });
    }

    const updateQuery = `
      UPDATE announcements
      SET title = ?, description = ?, announcement_date = ?, poster_url = COALESCE(?, poster_url), updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND created_by = ?
    `;

    const values = [title, description, date, posterUrl, id, userId];
    const result = await query(updateQuery, values);

    // Get the updated announcement
    const selectQuery = 'SELECT * FROM announcements WHERE id = ?';
    const announcementResult = await query(selectQuery, [id]);

    res.json({
      success: true,
      message: 'Announcement updated successfully',
      announcement: announcementResult
    });
  } catch (error) {
    console.error('Update announcement error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update announcement'
    });
  }
});

// Delete announcement (club heads only)
router.delete('/:id', authenticateToken, requireRole('clubhead'), async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deleteQuery = 'DELETE FROM announcements WHERE id = ? AND created_by = ?';
    const result = await query(deleteQuery, [id, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found or not authorized'
      });
    }

    res.json({
      success: true,
      message: 'Announcement deleted successfully'
    });
  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete announcement'
    });
  }
});

// Approve announcement (admins only)
router.put('/:id/approve', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;
    const adminId = req.user.id;

    const updateQuery = `
      UPDATE announcements
      SET status = 'approved', approved_by = ?, feedback = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const result = await query(updateQuery, [adminId, feedback, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    // Get the updated announcement
    const selectQuery = 'SELECT * FROM announcements WHERE id = ?';
    const announcementResult = await query(selectQuery, [id]);

    res.json({
      success: true,
      message: 'Announcement approved successfully',
      announcement: announcementResult
    });
  } catch (error) {
    console.error('Approve announcement error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve announcement'
    });
  }
});

// Reject announcement (admins only)
router.put('/:id/reject', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;
    const adminId = req.user.id;

    const updateQuery = `
      UPDATE announcements
      SET status = 'rejected', approved_by = ?, feedback = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const result = await query(updateQuery, [adminId, feedback, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    // Get the updated announcement
    const selectQuery = 'SELECT * FROM announcements WHERE id = ?';
    const announcementResult = await query(selectQuery, [id]);

    res.json({
      success: true,
      message: 'Announcement rejected',
      announcement: announcementResult
    });
  } catch (error) {
    console.error('Reject announcement error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject announcement'
    });
  }
});

module.exports = router;
