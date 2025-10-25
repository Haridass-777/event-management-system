-- MySQL Database Schema for Event Management System

-- Create database
CREATE DATABASE IF NOT EXISTS event_management;
USE event_management;

-- Create custom types (MySQL doesn't have ENUM in CREATE TYPE, so we'll use ENUM directly in columns)

-- Users table
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'clubhead', 'admin') NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    register_number VARCHAR(50),
    staff_id VARCHAR(50),
    department VARCHAR(100),
    year INT CHECK (year >= 1 AND year <= 4),
    contact_number VARCHAR(20),
    club_id INT, -- Will be set as FK after clubs table creation
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
);

-- Clubs table
CREATE TABLE clubs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    contact_email VARCHAR(255),
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_clubs_title (title)
);

-- Add foreign key constraint to users table
ALTER TABLE users ADD CONSTRAINT fk_users_club_id FOREIGN KEY (club_id) REFERENCES clubs(id);

-- Events table
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    club_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
    INDEX idx_events_club_id (club_id),
    INDEX idx_events_event_date (event_date)
);

-- Announcements table
CREATE TABLE announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    club_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    announcement_date DATE NOT NULL,
    poster_url VARCHAR(500),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    feedback TEXT,
    created_by CHAR(36) NOT NULL,
    approved_by CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id),
    INDEX idx_announcements_club_id (club_id),
    INDEX idx_announcements_status (status),
    INDEX idx_announcements_created_by (created_by)
);

-- Feedback table
CREATE TABLE feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    user_id CHAR(36) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comments TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY unique_feedback (event_id, user_id),
    INDEX idx_feedback_event_id (event_id)
);

-- Club memberships table (junction table)
CREATE TABLE club_memberships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    club_id INT NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'inactive') DEFAULT 'active',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (club_id) REFERENCES clubs(id),
    UNIQUE KEY unique_membership (user_id, club_id),
    INDEX idx_memberships_user_id (user_id),
    INDEX idx_memberships_club_id (club_id)
);

-- Event registrations table (junction table)
CREATE TABLE event_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    event_id INT NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('registered', 'attended', 'cancelled') DEFAULT 'registered',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (event_id) REFERENCES events(id),
    UNIQUE KEY unique_registration (user_id, event_id),
    INDEX idx_registrations_user_id (user_id),
    INDEX idx_registrations_event_id (event_id)
);

-- Insert initial club data
INSERT INTO clubs (title, description, contact_email, image_url) VALUES
('ASTRO CLUB', 'Explore the cosmos and celestial wonders', 'astro@example.com', '/assets/astroclublogo.jpg'),
('AUSEC CLUB', 'Robotics and automation enthusiasts', 'robotics@example.com', '/assets/ausec-logo.jpg'),
('CEG TECH FORUM', 'Technology and innovation discussions', 'music@example.com', '/assets/ceg-tech-forum-logo.jpg'),
('GUINDY TIMES', 'News, media and communication', 'drama@example.com', '/assets/guindy-times-club.jpeg'),
('LEO CLUB', 'Community service and leadership', 'service@example.com', '/assets/leo-club-logo.jpg'),
('PIXELS CLUB', 'Digital art and design collective', 'coding@example.com', '/assets/pixels-logo.jpg'),
('TWISTERA_CREW CLUB', 'Dance and movement arts', 'dance@example.com', '/assets/twistera_crew-logo.jpg'),
('THEATRON CLUB', 'Drama and performing arts', 'theatre@example.com', '/assets/theatron-logo.jpg');

-- Insert sample events
INSERT INTO events (club_id, title, description, event_date) VALUES
(1, 'Annual Fest', 'Our biggest event of the year with fun activities and competitions.', '2024-12-25'),
(1, 'Monthly Meetup', 'A casual gathering of club members to discuss ongoing projects.', '2024-11-15'),
(2, 'Coding Hackathon', '24-hour coding challenge open to all club members.', '2025-01-10'),
(3, 'Art Exhibition', 'Showcase your art projects and compete for prizes.', '2025-02-05'),
(2, 'Tech Talk', 'Guest lecture on latest trends in technology.', '2024-10-30');

-- Create views for frontend queries

-- View: User profiles with club information
CREATE VIEW user_profiles AS
SELECT
    u.id,
    u.email,
    u.role,
    u.full_name,
    u.register_number,
    u.staff_id,
    u.department,
    u.year,
    u.contact_number,
    u.created_at,
    u.updated_at,
    c.title as club_name,
    c.description as club_description,
    c.image_url as club_image
FROM users u
LEFT JOIN clubs c ON u.club_id = c.id;

-- View: Events with club information
CREATE VIEW events_with_clubs AS
SELECT
    e.id,
    e.title,
    e.description,
    e.event_date,
    e.created_at,
    c.title as club_name,
    c.description as club_description,
    c.image_url as club_image,
    c.contact_email as club_contact
FROM events e
JOIN clubs c ON e.club_id = c.id;

-- View: Announcements with creator and club information
CREATE VIEW announcements_detailed AS
SELECT
    a.id,
    a.title,
    a.description,
    a.announcement_date,
    a.poster_url,
    a.status,
    a.feedback,
    a.created_at,
    a.updated_at,
    c.title as club_name,
    c.image_url as club_image,
    u.full_name as created_by_name,
    u.role as created_by_role,
    au.full_name as approved_by_name
FROM announcements a
JOIN clubs c ON a.club_id = c.id
JOIN users u ON a.created_by = u.id
LEFT JOIN users au ON a.approved_by = au.id;

-- View: Event feedback with user information
CREATE VIEW feedback_with_users AS
SELECT
    f.id,
    f.rating,
    f.comments,
    f.submitted_at,
    e.title as event_title,
    e.event_date,
    c.title as club_name,
    u.full_name as user_name,
    u.email as user_email,
    u.role as user_role
FROM feedback f
JOIN events e ON f.event_id = e.id
JOIN clubs c ON e.club_id = c.id
JOIN users u ON f.user_id = u.id;

-- View: Club memberships with user details
CREATE VIEW memberships_detailed AS
SELECT
    m.id,
    m.joined_at,
    m.status as membership_status,
    c.title as club_name,
    c.description as club_description,
    c.image_url as club_image,
    u.full_name as user_name,
    u.email as user_email,
    u.role as user_role,
    u.register_number,
    u.department,
    u.year
FROM club_memberships m
JOIN clubs c ON m.club_id = c.id
JOIN users u ON m.user_id = u.id;

-- View: Event registrations with user and event details
CREATE VIEW registrations_detailed AS
SELECT
    r.id,
    r.registered_at,
    r.status as registration_status,
    e.title as event_title,
    e.description as event_description,
    e.event_date,
    c.title as club_name,
    c.image_url as club_image,
    u.full_name as user_name,
    u.email as user_email,
    u.role as user_role,
    u.register_number,
    u.contact_number
FROM event_registrations r
JOIN events e ON r.event_id = e.id
JOIN clubs c ON e.club_id = c.id
JOIN users u ON r.user_id = u.id;

-- View: Dashboard statistics
CREATE VIEW dashboard_stats AS
SELECT
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM clubs) as total_clubs,
    (SELECT COUNT(*) FROM events) as total_events,
    (SELECT COUNT(*) FROM announcements WHERE status = 'approved') as approved_announcements,
    (SELECT COUNT(*) FROM club_memberships WHERE status = 'active') as active_memberships,
    (SELECT COUNT(*) FROM event_registrations WHERE status = 'registered') as active_registrations,
    (SELECT AVG(rating) FROM feedback) as average_feedback_rating;
