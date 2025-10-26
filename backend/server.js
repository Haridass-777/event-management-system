 // server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  port: 3308,
  user: 'root',
  password: 'P@ssw0rd',
  database: 'event'
});

db.connect(err => {
  if (err) return console.error('DB connection error:', err);
  console.log('MySQL connected');

  db.query('USE event', (err) => {
    if (err) return console.error('Error selecting database:', err);

    // Create tables
    const tables = [
      `CREATE TABLE IF NOT EXISTS clubs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        contact_email VARCHAR(255),
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_clubs_title (title)
      )`,
      `CREATE TABLE IF NOT EXISTS events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        club_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        event_date DATE NOT NULL,
        registered_by VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
        INDEX idx_events_club_id (club_id),
        INDEX idx_events_event_date (event_date)
      )`,
      `CREATE TABLE IF NOT EXISTS club_registrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        club_id INT NOT NULL,
        student_enrollment VARCHAR(255) NOT NULL,
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS event_registrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        event_id INT NOT NULL,
        student_enrollment VARCHAR(255) NOT NULL,
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        role ENUM('student','clubhead','admin') NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        degree VARCHAR(255),
        department VARCHAR(255),
        enrollment VARCHAR(50),
        contact VARCHAR(20),
        avatar VARCHAR(255)
      )`,
      `CREATE TABLE IF NOT EXISTS announcements (
        id INT AUTO_INCREMENT PRIMARY KEY,
        club_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        date DATE NOT NULL,
        status ENUM('pending','approved','rejected') DEFAULT 'pending',
        feedback TEXT,
        submitted_by VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
        INDEX idx_announcements_club_id (club_id),
        INDEX idx_announcements_status (status)
      )`
    ];

    tables.forEach(sql => db.query(sql, err => err && console.error('Table error:', err)));

    console.log('All tables ready ✅');
  });
});

// === Register ===
app.post('/api/register', (req, res) => {
  const { id, role, name, email, password, degree, department, enrollment, contact } = req.body;
  if (!id || !role || !name || !email || !password)
    return res.status(400).json({ error: 'Missing required fields' });

  // Check if id or email already exists
  const checkSql = 'SELECT id FROM users WHERE id=? OR email=?';
  db.query(checkSql, [id, email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) return res.status(409).json({ error: 'ID or Email already exists' });

    // Insert new user
    const insertSql = 'INSERT INTO users (id, role, name, email, password, degree, department, enrollment, contact) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(insertSql, [id, role, name, email, password, degree || null, department || null, enrollment || null, contact || null], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    });
  });
});

// === Login ===
app.post('/api/login', (req, res) => {
  const { emailOrId, password } = req.body;
  if (!emailOrId || !password)
    return res.status(400).json({ error: 'Missing credentials' });

  const sql = 'SELECT * FROM users WHERE (id=? OR email=?) AND password=?';
  db.query(sql, [emailOrId, emailOrId, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ success: true, user: results[0] });
  });
});

// === Get all clubs ===
app.get('/api/clubs', (req, res) => {
  db.query('SELECT * FROM clubs', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// === Get all events ===
app.get('/api/events', (req, res) => {
  const sql = `
    SELECT e.*, c.title AS club_title
    FROM events e
    LEFT JOIN clubs c ON e.club_id = c.id
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// === Get approved announcements ===
app.get('/api/announcements/approved', (req, res) => {
  const sql = 'SELECT * FROM announcements WHERE status = "approved" ORDER BY created_at DESC';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// === Register club ===
app.post('/api/clubs/register', (req, res) => {
  const { clubId, studentEnrollment } = req.body;
  if (!clubId || !studentEnrollment)
    return res.status(400).json({ error: 'Missing fields' });

  db.query(
    'INSERT INTO club_registrations (club_id, student_enrollment) VALUES (?, ?)',
    [clubId, studentEnrollment],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// === Leave club ===
app.post('/api/clubs/leave', (req, res) => {
  const { clubId, studentEnrollment } = req.body;
  db.query(
    'DELETE FROM club_registrations WHERE club_id=? AND student_enrollment=?',
    [clubId, studentEnrollment],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.json({ success: false });
      res.json({ success: true });
    }
  );
});

// === Register event ===
app.post('/api/events/register', (req, res) => {
  const { eventId, studentEnrollment } = req.body;
  db.query(
    'INSERT INTO event_registrations (event_id, student_enrollment) VALUES (?, ?)',
    [eventId, studentEnrollment],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// === Get student's registered clubs ===
app.get('/api/my-clubs/:enrollment', (req, res) => {
  const { enrollment } = req.params;
  const sql = `
    SELECT c.*
    FROM clubs c
    JOIN club_registrations r ON c.id=r.club_id
    WHERE r.student_enrollment=?
  `;
  db.query(sql, [enrollment], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// === Get student's registered events ===
app.get('/api/my-events/:enrollment', (req, res) => {
  const { enrollment } = req.params;
  const sql = `
    SELECT e.*, c.title AS club_title
    FROM events e
    JOIN event_registrations r ON e.id=r.event_id
    LEFT JOIN clubs c ON e.club_id=c.id
    WHERE r.student_enrollment=?
  `;
  db.query(sql, [enrollment], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

 
 app.get('/api/users/:enrollment', (req, res) => {
  const { enrollment } = req.params;
  const sql = 'SELECT * FROM users WHERE enrollment = ?';
  db.query(sql, [enrollment], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(404).json({ error: 'Student not found' }); // Must return JSON
    res.json(results[0]);
  });
});

// === Fetch registered user (POST) ===
app.post('/api/users/fetch', (req, res) => {
  const { enrollment } = req.body;
  if (!enrollment) return res.status(400).json({ error: 'Enrollment is required' });

  const sql = 'SELECT * FROM users WHERE enrollment = ?';
  db.query(sql, [enrollment], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(404).json({ error: 'User not found' });
    res.json(results[0]);
  });
});

// === Create announcement ===
app.post('/api/announcements', (req, res) => {
  const { clubId, title, description, date, submittedBy } = req.body;
  if (!clubId || !title || !date || !submittedBy)
    return res.status(400).json({ error: 'Missing required fields' });

  const sql = 'INSERT INTO announcements (club_id, title, description, date, submitted_by) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [clubId, title, description || null, date, submittedBy], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, id: result.insertId });
  });
});

// === Get announcements for a club ===
app.get('/api/announcements/:clubId', (req, res) => {
  const { clubId } = req.params;
  const sql = 'SELECT * FROM announcements WHERE club_id = ? ORDER BY created_at DESC';
  db.query(sql, [clubId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// === Delete announcement ===
app.delete('/api/announcements/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM announcements WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Announcement not found' });
    res.json({ success: true });
  });
});

// === Get all pending announcements ===
app.get('/api/announcements/pending', (req, res) => {
  const sql = 'SELECT * FROM announcements WHERE status = "pending" ORDER BY created_at ASC';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// === Update announcement status ===
app.put('/api/announcements/:id', (req, res) => {
  const { id } = req.params;
  const { status, feedback } = req.body;
  if (!status) return res.status(400).json({ error: 'Status is required' });

  const sql = 'UPDATE announcements SET status = ?, feedback = ? WHERE id = ?';
  db.query(sql, [status, feedback || null, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Announcement not found' });
    res.json({ success: true });
  });
});





const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
