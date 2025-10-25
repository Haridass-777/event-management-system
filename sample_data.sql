USE event_management;

-- Insert sample users
INSERT INTO users (id, email, password_hash, role, full_name, register_number, staff_id, department, year, contact_number, club_id) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'admin@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4fY9H5cxm', 'admin', 'Admin User', NULL, NULL, NULL, NULL, '1234567890', NULL),
('550e8400-e29b-41d4-a716-446655440001', 'student1@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4fY9H5cxm', 'student', 'John Doe', '2023001', NULL, 'Computer Science', 3, '9876543210', NULL),
('550e8400-e29b-41d4-a716-446655440002', 'student2@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4fY9H5cxm', 'student', 'Jane Smith', '2023002', NULL, 'Electrical Engineering', 2, '9876543211', NULL),
('550e8400-e29b-41d4-a716-446655440003', 'student3@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4fY9H5cxm', 'student', 'Bob Johnson', '2023003', NULL, 'Mechanical Engineering', 4, '9876543212', NULL),
('550e8400-e29b-41d4-a716-446655440004', 'student4@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4fY9H5cxm', 'student', 'Alice Brown', '2023004', NULL, 'Civil Engineering', 1, '9876543213', NULL),
('550e8400-e29b-41d4-a716-446655440005', 'student5@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4fY9H5cxm', 'student', 'Charlie Wilson', '2023005', NULL, 'Information Technology', 3, '9876543214', NULL),
('550e8400-e29b-41d4-a716-446655440006', 'student6@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4fY9H5cxm', 'student', 'Diana Davis', '2023006', NULL, 'Electronics', 2, '9876543215', NULL),
('550e8400-e29b-41d4-a716-446655440007', 'student7@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4fY9H5cxm', 'student', 'Eve Miller', '2023007', NULL, 'Chemical Engineering', 4, '9876543216', NULL),
('550e8400-e29b-41d4-a716-446655440008', 'student8@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4fY9H5cxm', 'student', 'Frank Garcia', '2023008', NULL, 'Biotechnology', 1, '9876543217', NULL),
('550e8400-e29b-41d4-a716-446655440009', 'student9@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4fY9H5cxm', 'student', 'Grace Lee', '2023009', NULL, 'Aerospace Engineering', 3, '9876543218', NULL),
('550e8400-e29b-41d4-a716-446655440010', 'student10@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4fY9H5cxm', 'student', 'Henry Taylor', '2023010', NULL, 'Computer Science', 2, '9876543219', NULL),
('550e8400-e29b-41d4-a716-446655440011', 'clubhead1@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4fY9H5cxm', 'clubhead', 'Club Head One', NULL, 'CH001', 'Computer Science', NULL, '9876543220', 1),
('550e8400-e29b-41d4-a716-446655440012', 'clubhead2@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4fY9H5cxm', 'clubhead', 'Club Head Two', NULL, 'CH002', 'Electrical Engineering', NULL, '9876543221', 2);

-- Insert sample events
INSERT INTO events (club_id, title, description, event_date) VALUES
(1, 'Annual Fest', 'Our biggest event of the year with fun activities and competitions.', '2024-12-25'),
(1, 'Monthly Meetup', 'A casual gathering of club members to discuss ongoing projects.', '2024-11-15'),
(2, 'Coding Hackathon', '24-hour coding challenge open to all club members.', '2025-01-10'),
(3, 'Art Exhibition', 'Showcase your art projects and compete for prizes.', '2025-02-05'),
(2, 'Tech Talk', 'Guest lecture on latest trends in technology.', '2024-10-30'),
(4, 'Media Workshop', 'Learn about digital media production and journalism.', '2024-11-20'),
(5, 'Community Service Day', 'Volunteer activities in local community.', '2024-12-01'),
(6, 'Design Competition', 'Showcase your design skills and win prizes.', '2025-01-15'),
(7, 'Dance Performance', 'Annual dance showcase event.', '2024-11-25'),
(8, 'Theatre Workshop', 'Learn acting and stage production.', '2024-12-10');

-- Insert sample announcements
INSERT INTO announcements (club_id, title, description, announcement_date, poster_url, status, created_by) VALUES
(1, 'New Astronomy Equipment', 'We have acquired new telescopes for stargazing sessions.', '2024-10-15', '/assets/poster1.jpg', 'approved', '550e8400-e29b-41d4-a716-446655440000'),
(2, 'Robotics Competition', 'Join our team for the upcoming robotics competition.', '2024-10-20', '/assets/poster2.jpg', 'approved', '550e8400-e29b-41d4-a716-446655440000'),
(3, 'Tech Conference', 'Annual technology conference featuring industry experts.', '2024-11-01', '/assets/poster3.jpg', 'pending', '550e8400-e29b-41d4-a716-446655440000'),
(4, 'Journalism Workshop', 'Learn the basics of investigative journalism.', '2024-11-05', '/assets/poster4.jpg', 'approved', '550e8400-e29b-41d4-a716-446655440000'),
(5, 'Leadership Training', 'Develop your leadership skills with our training program.', '2024-11-10', '/assets/poster5.jpg', 'approved', '550e8400-e29b-41d4-a716-446655440000'),
(6, 'Digital Art Contest', 'Submit your digital artwork for our monthly contest.', '2024-11-15', '/assets/poster6.jpg', 'pending', '550e8400-e29b-41d4-a716-446655440000'),
(7, 'Dance Auditions', 'Auditions for our upcoming dance performance.', '2024-11-20', '/assets/poster7.jpg', 'approved', '550e8400-e29b-41d4-a716-446655440000'),
(8, 'Theatre Rehearsals', 'Join our theatre group for regular rehearsals.', '2024-11-25', '/assets/poster8.jpg', 'approved', '550e8400-e29b-41d4-a716-446655440000'),
(1, 'Stargazing Night', 'Join us for a night of stargazing with our new equipment.', '2024-12-01', '/assets/poster9.jpg', 'pending', '550e8400-e29b-41d4-a716-446655440000'),
(2, 'AI Workshop', 'Learn about artificial intelligence and machine learning.', '2024-12-05', '/assets/poster10.jpg', 'approved', '550e8400-e29b-41d4-a716-446655440000');

-- Insert sample club memberships
INSERT INTO club_memberships (user_id, club_id, status) VALUES
('550e8400-e29b-41d4-a716-446655440001', 1, 'active'),
('550e8400-e29b-41d4-a716-446655440002', 2, 'active'),
('550e8400-e29b-41d4-a716-446655440003', 3, 'active'),
('550e8400-e29b-41d4-a716-446655440004', 4, 'active'),
('550e8400-e29b-41d4-a716-446655440005', 5, 'active'),
('550e8400-e29b-41d4-a716-446655440006', 6, 'active'),
('550e8400-e29b-41d4-a716-446655440007', 7, 'active'),
('550e8400-e29b-41d4-a716-446655440008', 8, 'active'),
('550e8400-e29b-41d4-a716-446655440009', 1, 'active'),
('550e8400-e29b-41d4-a716-446655440010', 2, 'active');

-- Insert sample event registrations
INSERT INTO event_registrations (user_id, event_id, status) VALUES
('550e8400-e29b-41d4-a716-446655440001', 1, 'registered'),
('550e8400-e29b-41d4-a716-446655440002', 2, 'registered'),
('550e8400-e29b-41d4-a716-446655440003', 3, 'registered'),
('550e8400-e29b-41d4-a716-446655440004', 4, 'registered'),
('550e8400-e29b-41d4-a716-446655440005', 5, 'registered'),
('550e8400-e29b-41d4-a716-446655440006', 6, 'registered'),
('550e8400-e29b-41d4-a716-446655440007', 7, 'registered'),
('550e8400-e29b-41d4-a716-446655440008', 8, 'registered'),
('550e8400-e29b-41d4-a716-446655440009', 9, 'registered'),
('550e8400-e29b-41d4-a716-446655440010', 10, 'registered');

-- Insert sample feedback
INSERT INTO feedback (event_id, user_id, rating, comments) VALUES
(1, '550e8400-e29b-41d4-a716-446655440001', 5, 'Amazing event! Learned a lot about astronomy.'),
(2, '550e8400-e29b-41d4-a716-446655440002', 4, 'Great meetup, looking forward to more.'),
(3, '550e8400-e29b-41d4-a716-446655440003', 5, 'The hackathon was challenging and fun.'),
(4, '550e8400-e29b-41d4-a716-446655440004', 4, 'Beautiful art exhibition, very inspiring.'),
(5, '550e8400-e29b-41d4-a716-446655440005', 5, 'Excellent tech talk, very informative.');
