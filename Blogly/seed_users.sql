-- Drop the database if it exists
DROP DATABASE IF EXISTS  users;

-- Create the database
CREATE DATABASE users;

-- Connect to the database
\c users

-- Create the users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    img_url TEXT
);

INSERT INTO users (first_name, last_name) VALUES ('Sol','Nguyen'), ('John','Doe');