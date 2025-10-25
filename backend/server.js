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
  user: 'root',
  password: 'Hari@4455',
  database: 'event_management'
});

db.connect(err => {
  if (err) return console.error('DB connection error:', err);
  console.log('MySQL connected');

  db.query('USE event_management', (err) => {
    if (err) return console.error('Error selecting database:', err);

    // Create tables
    const tables = [
      `CREATE TABLE IF NOT EXISTS clubs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(255),
        contact_email VARCHAR(255)
      )`,
      `CREATE TABLE IF NOT EXISTS events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        club_id INT,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        event_date DATE,
        registered_by VARCHAR(255),
        FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS club_registrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        club_id INT,
        student_enrollment VARCHAR(255),
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS event_registrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        event_id INT,
        student_enrollment VARCHAR(255),
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        role ENUM('student','clubhead','admin') NOT NULL,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL,
        degree VARCHAR(100),
        department VARCHAR(100),
        enrollment VARCHAR(50),
        contact VARCHAR(20),
        avatar VARCHAR(255)
      )`
    ];

    tables.forEach(sql => db.query(sql, err => err && console.error('Table error:', err)));

    console.log('All tables ready ✅');
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





const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
