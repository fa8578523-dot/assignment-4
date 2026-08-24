-- Assignment Part 2: DDL Script for ERD Mapping

-- 1. Create User Table
CREATE TABLE IF NOT EXISTS "User" (
    id SERIAL PRIMARY KEY,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user'
);

-- 2. Create User_Phone Table (Multi-valued Attribute Mapping)
CREATE TABLE IF NOT EXISTS "User_Phone" (
    userId INT NOT NULL,
    phone VARCHAR(30) NOT NULL,
    PRIMARY KEY (userId, phone),
    FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE
);

-- 3. Create Product Table (1:N Relationship Mapping with userId FK)
CREATE TABLE IF NOT EXISTS "Product" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    isDeleted BOOLEAN NOT NULL DEFAULT FALSE,
    userId INT REFERENCES "User"(id) ON DELETE SET NULL
);
