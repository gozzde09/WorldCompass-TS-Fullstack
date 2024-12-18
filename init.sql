DROP TABLE IF EXISTS travellist;
DROP TABLE IF EXISTS countries;
DROP TABLE IF EXISTS visitstatus;
DROP TABLE IF EXISTS users;

-- 1. Countries Table
CREATE TABLE countries (
    country_id SERIAL PRIMARY KEY,
    country_name VARCHAR(100) UNIQUE NOT NULL,
    country_description TEXT,
    country_capital VARCHAR(100),
    country_population INT,
    country_continent VARCHAR(100),
    country_language VARCHAR(100),
    country_currency VARCHAR(100),
    country_flag TEXT
);

-- 2. Status Table
CREATE TABLE visitstatus (
    status_id SERIAL PRIMARY KEY,
    status_name VARCHAR(50) NOT NULL
);

-- 3. Users Table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(50) NOT NULL
);

-- 4. Travel List Table
CREATE TABLE travellist (
    travellist_id SERIAL PRIMARY KEY,
    country_id INT REFERENCES countries(country_id),
    status_id INT REFERENCES visitstatus(status_id),
    user_id INT REFERENCES users(user_id),
    UNIQUE (country_id)
);

INSERT INTO visitstatus (status_name)
VALUES
('Want to visit'),
('Visited');

INSERT INTO users (first_name, last_name, email, password)
VALUES
('Test', 'Testson', 'test@example.com', 'test'),
('Alice', 'Johnson', 'alice@example.com', 'password1'),
('Bob', 'Smith', 'bob@example.com', 'password2');

-- SELECT
--     travellist.travellist_id,
--     users.first_name,
--     countries.country_name,
--     visitstatus.status_name
-- FROM travellist
-- JOIN users ON travellist.user_id = users.user_id
-- JOIN countries ON travellist.country_id = countries.country_id
-- JOIN visitstatus ON travellist.status_id = visitstatus.status_id;
