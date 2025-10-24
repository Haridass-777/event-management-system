-- PostgreSQL Database Schema for Event Management System

-- Enable uuid-ossp extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('student', 'clubhead', 'admin');
CREATE TYPE announcement_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE membership_status AS ENUM ('active', 'inactive');
CREATE TYPE registration_status AS ENUM ('registered', 'attended', 'cancelled');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    register_number VARCHAR(50),
    staff_id VARCHAR(50),
    department VARCHAR(100),
    year INTEGER CHECK (year >= 1 AND year <= 4),
    contact_number VARCHAR(20),
    club_id INTEGER, -- Will be set as FK after clubs table creation
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Clubs table
CREATE TABLE clubs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    contact_email VARCHAR(255),
    image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraint to users table
ALTER TABLE users ADD CONSTRAINT fk_users_club_id FOREIGN KEY (club_id) REFERENCES clubs(id);

-- Events table
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    club_id INTEGER NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Announcements table
CREATE TABLE announcements (
    id SERIAL PRIMARY KEY,
    club_id INTEGER NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    announcement_date DATE NOT NULL,
    poster_url VARCHAR(500),
    status announcement_status DEFAULT 'pending',
    feedback TEXT,
    created_by UUID NOT NULL REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Feedback table
CREATE TABLE feedback (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comments TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, user_id) -- One feedback per user per event
);

-- Club memberships table (junction table)
CREATE TABLE club_memberships (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    club_id INTEGER NOT NULL REFERENCES clubs(id),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status membership_status DEFAULT 'active',
    UNIQUE(user_id, club_id) -- One membership record per user-club pair
);

-- Event registrations table (junction table)
CREATE TABLE event_registrations (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    event_id INTEGER NOT NULL REFERENCES events(id),
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status registration_status DEFAULT 'registered',
    UNIQUE(user_id, event_id) -- One registration per user per event
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_events_club_id ON events(club_id);
CREATE INDEX idx_events_event_date ON events(event_date);
CREATE INDEX idx_announcements_club_id ON announcements(club_id);
CREATE INDEX idx_announcements_status ON announcements(status);
CREATE INDEX idx_announcements_created_by ON announcements(created_by);
CREATE INDEX idx_feedback_event_id ON feedback(event_id);
CREATE INDEX idx_club_memberships_user_id ON club_memberships(user_id);
CREATE INDEX idx_club_memberships_club_id ON club_memberships(club_id);
CREATE INDEX idx_event_registrations_user_id ON event_registrations(user_id);
CREATE INDEX idx_event_registrations_event_id ON event_registrations(event_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial club data from clubsConfig.js
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
