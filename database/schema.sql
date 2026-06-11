-- Schema Placeholder for NavGuide

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    academic_level TEXT,
    academic_marks REAL,
    academic_stream TEXT,
    career_goal TEXT,
    college_type TEXT,
    budget INTEGER,
    location TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS interests (
    user_id TEXT,
    interest_id TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id),
    PRIMARY KEY(user_id, interest_id)
);

CREATE TABLE IF NOT EXISTS engineering_colleges (
    id INT PRIMARY KEY,
    college_name VARCHAR(255),
    location VARCHAR(100),
    college_type VARCHAR(50),
    naac_grade VARCHAR(10),
    top_course VARCHAR(255),
    total_fees INT,
    highest_package INT,
    rating DECIMAL(2,1)
);
