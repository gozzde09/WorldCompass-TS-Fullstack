DROP TABLE IF EXISTS bucketlist;
DROP TABLE IF EXISTS countries;
DROP TABLE IF EXISTS visitstatus;
DROP TABLE IF EXISTS users;

-- 1. Countries Table
CREATE TABLE countries (
    country_id SERIAL PRIMARY KEY,
    country_name VARCHAR(50) UNIQUE NOT NULL,
    country_description TEXT,
    country_capital VARCHAR(50),
    country_population INT,
    country_continent VARCHAR(50),
    country_language VARCHAR(50),
    country_currency VARCHAR(50)
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

-- 4. Bucket List Table
CREATE TABLE bucketlist (
    bucketlist_id SERIAL PRIMARY KEY,
    country_id INT REFERENCES countries(country_id),
    status_id INT REFERENCES visitstatus(status_id),
    user_id INT REFERENCES users(user_id),
    notes TEXT,
    UNIQUE (country_id, status_id, user_id)
);

INSERT INTO countries (country_name, country_description, country_capital, country_population, country_continent, country_language, country_currency)
VALUES
('Japan', 'A country known for its rich culture, technology, and cherry blossoms.', 'Tokyo', 125800000, 'Asia', 'Japanese', 'Yen'),
('Sweden', 'A Scandinavian nation known for its forests and advanced social systems.', 'Stockholm', 10350000, 'Europe', 'Swedish', 'Krona'),
('USA', 'A large and diverse country known for its influence on world culture and economy.', 'Washington D.C.', 331000000, 'North America', 'English', 'Dollar');

INSERT INTO visitstatus (status_name)
VALUES
('Want to visit'),
('Visited');

INSERT INTO users (first_name, last_name, email, password)
VALUES
('Alice', 'Johnson', 'alice@example.com', 'hashedpassword1'),
('Bob', 'Smith', 'bob@example.com', 'hashedpassword2'),
('Charlie', 'Brown', 'charlie@example.com', 'hashedpassword3');


INSERT INTO bucketlist (country_id, status_id, user_id, notes)
VALUES
(1, 1, 1, 'Japan is a must-see destination!'),   -- country_id = 1 (Japan), status_id = 1 (Want to visit), user_id = 1 (Alice)
(2, 2, 2, 'Visited Stockholm last summer.'),    -- country_id = 2 (Sweden), status_id = 2 (Visited), user_id = 2 (Bob)
(3, 1, 3, 'Planning to visit the USA next year.');

SELECT
    bucketlist.bucketlist_id,
    users.first_name,
    countries.country_name,
    visitstatus.status_name,
    bucketlist.notes
FROM bucketList
JOIN users ON bucketlist.user_id = users.user_id
JOIN countries ON bucketlist.country_id = countries.country_id
JOIN visitstatus ON bucketlist.status_id = visitstatus.status_id;
