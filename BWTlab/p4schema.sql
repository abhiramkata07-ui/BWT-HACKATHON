-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER,
    email TEXT
);

-- Insert Demo Data
INSERT INTO users (name, age, email) VALUES
('Arjun', 23, 'arjun@gmail.com'),
('Rahul', 25, 'rahul@gmail.com'),
('Priya', 22, 'priya@gmail.com'),
('Sneha', 24, 'sneha@gmail.com'),
('Kiran', 21, 'kiran@gmail.com'),
('Anil', 26, 'anil@gmail.com'),
('Deepika', 23, 'deepika@gmail.com'),
('Ramesh', 27, 'ramesh@gmail.com'),
('Pooja', 20, 'pooja@gmail.com'),
('Vijay', 28, 'vijay@gmail.com');