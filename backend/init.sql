DROP TABLE IF EXISTS countries;
DROP TABLE IF EXISTS status;
DROP TABLE IF EXISTS bucketList;
DROP TABLE IF EXISTS users;

-- 1. Countries Table
CREATE TABLE countries (
    countryId SERIAL PRIMARY KEY,
    countryName VARCHAR(50) UNIQUE,
    countryDescription TEXT,
    countryCapital VARCHAR(50),
    countryPopulation INT,
    countryContinent VARCHAR(50),
    countryLanguage VARCHAR(50),
    countryCurrency VARCHAR(50)
);

-- 2. Status Table
CREATE TABLE status (
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
CREATE TABLE bucketList (
    bucketList_id SERIAL PRIMARY KEY,
    country_id INT REFERENCES countries(countryId),
    status_id INT REFERENCES Status(status_id),
    notes TEXT,
    UNIQUE (country_id, status_id)  -- Förhindra duplicering av status för ett land
);
