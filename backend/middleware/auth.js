const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const userQuery = `SELECT id, email, role, full_name, club_id FROM users WHERE id = ?`;

// Verify token (checks signature + gets typed payload)
const decoded = jwt.verify(token, process.env.JWT_SECRET) ;
// Now TypeScript knows decoded has an 'id' property
// @ts-ignore
const userResult = await query(userQuery, [decoded.id]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    req.user = userResult.rows[0];
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

// Middleware to check if user has required role
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Middleware to check if user is club head of specific club
const requireClubHead = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'clubhead') {
    return res.status(403).json({
      success: false,
      message: 'Club head access required'
    });
  }

  // For club-specific operations, check if user is head of that club
  if (req.params.clubId) {
    const clubId = parseInt(req.params.clubId);
    if (req.user.club_id !== clubId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized for this club'
      });
    }
  }

  next();
};

module.exports = {
  authenticateToken,
  requireRole,
  requireClubHead
};
