import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { query } from '../config/database';

interface AuthenticatedUser {
  id: number;
  email: string;
  role: string;
  full_name: string;
  club_id?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

// Middleware to verify JWT token
const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access token required'
      });
      return;
    }

    const userQuery = `SELECT id, email, role, full_name, club_id FROM users WHERE id = ?`;

    // Verify token (checks signature + gets typed payload)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    // Now TypeScript knows decoded has an 'id' property
    const userResult = await query<AuthenticatedUser>(userQuery, [decoded.id]);

    if (userResult.rows.length === 0) {
      res.status(401).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    
    next();
  } catch (error) {
    
      return;
    }
    console.error('Auth middleware error:');
    res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

// Middleware to check if user has required role
const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
      return;
    }

    next();
  };
};

// Middleware to check if user is club head of specific club
const requireClubHead = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
    return;
  }

  if (req.user.role !== 'clubhead') {
    res.status(403).json({
      success: false,
      message: 'Club head access required'
    });
    return;
  }

  // For club-specific operations, check if user is head of that club
  if (req.params.clubId) {
    const clubId = parseInt(req.params.clubId, 10);
    if (req.user.club_id !== clubId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized for this club'
      });
      return;
    }
  }

  next();
};

export { authenticateToken, requireRole, requireClubHead };
