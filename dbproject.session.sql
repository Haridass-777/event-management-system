 


CREATE TABLE events (
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
);


INSERT INTO events (club_id, title, description, event_date) VALUES
(1, 'Stargazing Night', 'Observe stars with telescopes', '2025-11-30'),
(2, 'Robotics Workshop', 'Learn to build robots', '2025-12-05');


CREATE TABLE IF NOT EXISTS club_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    club_id INT NOT NULL,
    student_enrollment VARCHAR(255) NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE
);

 

CREATE TABLE IF NOT EXISTS event_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    student_enrollment VARCHAR(255) NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS users (
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
);


-- STUDENTS
INSERT INTO users (id, role, name, email, password, degree, department, enrollment, contact, avatar) VALUES
('student1', 'student', 'Hari Dass', 'hari@example.com', '1234', 'B.E Computer Science', 'Computer Science and Engineering', '2023-ENG-001', '9876543210', '/assets/student1.jpg'),
('student2', 'student', 'Priya Kumar', 'priya@example.com', '5678', 'B.E Electrical Engineering', 'Electrical and Electronics Engineering', '2023-ENG-002', '9876501234', '/assets/student2.jpg'),
('student3', 'student', 'Arun Raj', 'arun@example.com', 'abcd', 'B.Tech Information Technology', 'Information Technology', '2023-ENG-003', '9847563210', '/assets/student3.jpg'),
('student4', 'student', 'Divya Sharma', 'divya@example.com', 'divya123', 'B.E Mechanical Engineering', 'Mechanical Engineering', '2023-ENG-004', '9823456710', '/assets/student4.jpg'),
('student5', 'student', 'Rahul Menon', 'rahul@example.com', 'rahul321', 'B.E Civil Engineering', 'Civil Engineering', '2023-ENG-005', '9876123450', '/assets/student5.jpg');

-- CLUB HEADS
INSERT INTO users (id, role, name, email, password) VALUES
('clubhead1', 'clubhead', 'Suresh Kumar', 'suresh@clubs.com', 'abcd'),
('clubhead2', 'clubhead', 'Lakshmi Devi', 'lakshmi@clubs.com', '1234'),
('clubhead3', 'clubhead', 'Rajesh Patel', 'rajesh@clubs.com', '5678'),
('clubhead4', 'clubhead', 'Meena Singh', 'meena@clubs.com', 'meena'),
('clubhead5', 'clubhead', 'Anil Kapoor', 'anil@clubs.com', 'anil123');

-- ADMINS
INSERT INTO users (id, role, name, email, password) VALUES
('admin1', 'admin', 'Admin One', 'admin1@cems.com', 'admin1'),
('admin2', 'admin', 'Admin Two', 'admin2@cems.com', 'admin2'),
('admin3', 'admin', 'Admin Three', 'admin3@cems.com', 'admin3'),
('admin4', 'admin', 'Admin Four', 'admin4@cems.com', 'admin4'),
('admin5', 'admin', 'Admin Five', 'admin5@cems.com', 'admin5');








 








