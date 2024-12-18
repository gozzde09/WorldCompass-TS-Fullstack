import { Client } from "pg";
import * as dotenv from "dotenv";
import cors from "cors";
import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";

import jwt from "jsonwebtoken";

import { Country } from "./types/interfaces";
import { User } from "./types/interfaces";
import { TravelList } from "./types/interfaces";

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

const client = new Client({
  connectionString: process.env.PGURI,
});
client.connect();

//                 ----- USERS -----
// GET - users
app.get("/api/users", async (_req: Request, res: Response) => {
  try {
    const { rows } = await client.query<User>(`SELECT * FROM users`);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json(error + "Error fetching users");
  }
});

// POST-REGISTER user
app.post("/api/users", async (req: Request, res: Response) => {
  const { first_name, last_name, email, password }: User = req.body;
  // Kontrollera om användare redan fanns
  const query = "SELECT * FROM users WHERE email = $1";
  const { rows } = await client.query<User>(query, [email]);

  if (rows.length > 0) {
    res.status(400).json({ error: "User already exists" });
  }

  if (rows.length === 0) {
    try {
      const insertQuery = `
      INSERT INTO users (first_name, last_name, email, password)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
      const values = [first_name, last_name, email, password];
      const insertResult = await client.query<User>(insertQuery, values);
      const user = insertResult.rows[0];

      const token = jwt.sign({ userId: user.user_id }, "my_jwt_secret", {
        expiresIn: "1h",
      });

      res.status(201).send({
        message: "Registering successfull",
        user: user,
        token: token,
      });
    } catch (error) {
      res.status(500).json({ error: "Error adding user" });
    }
  }
});

// POST - Login
app.post("/api/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const query = "SELECT * FROM users WHERE email = $1";
    const { rows } = await client.query(query, [email]);

    // Kontrollera om användare redan fanns
    if (rows.length === 0) {
      res.status(401).json({ error: "Email is not registrerad. " });
    }

    const user = rows[0];
    // Compare the password
    if (password !== user.password) {
      res.status(401).json({ error: "Invalid password" });
    }

    // If password is valid, generate the JWT token
    const token = jwt.sign({ userId: user.user_id }, "my_jwt_secret", {
      expiresIn: "1h",
    });

    res.json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//                    ----- COUNTRIES -----
// Read and insert data from countries.json into the database + initial data TravelList
const insertDataFromFile = () => {
  fs.readFile(path.join(__dirname, "countries.json"), "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the JSON file:", err);
      return;
    }
    const countries = JSON.parse(data);
    countries.forEach((country: Country) => {
      const insertQuery = `
        INSERT INTO countries (country_name, country_description, country_capital, country_population, country_continent, country_language, country_currency, country_flag)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (country_name) DO NOTHING;
      `;
      const values = [
        country.country_name,
        country.country_description,
        country.country_capital,
        country.country_population,
        country.country_continent,
        country.country_language,
        country.country_currency,
        country.country_flag,
      ];

      client.query(insertQuery, values, (err) => {
        if (err) {
          console.error("Error inserting country:", err);
        }
      });
    });
    console.log("Data successfully inserted into the database");
    // Initial data for travellist
    const initialQuery = `
      INSERT INTO travellist (country_id, status_id, user_id)
      VALUES (1, 1, 1), (2, 1, 1), (3, 1, 1), (4, 2, 1), (5, 2, 1), (6, 2, 1)
      ON CONFLICT DO NOTHING;
    `;
    try {
      client.query(initialQuery);
      console.log("Initial data successfully inserted into travellist.");
    } catch (err) {
      console.error("Error inserting initial data into travellist:", err);
    }
  });
};
// Insert data when server starts
insertDataFromFile();

// GET - ett land med detaljer
app.get("/api/countries/:name", async (req: Request, res: Response) => {
  const { name } = req.params;
  // Namnet omvandlat till lowercase och utan mellanslag
  const formattedName = name.replace(/\s+/g, "").toLowerCase();

  try {
    const { rows } = await client.query<Country>(
      `SELECT * FROM countries WHERE LOWER(REPLACE(country_name, ' ', '')) = $1`,
      [formattedName]
    );
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching country details" });
  }
});

//                        ----- TRAVEL-LIST -----
// GET - Travellist baserad på userId
app.get("/api/travellist/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const query = `
      SELECT
        t.country_id,
        t.status_id,
        c.country_name
      FROM travellist t
      INNER JOIN countries c ON t.country_id = c.country_id
      WHERE t.user_id = $1;
    `;
    const { rows } = await client.query(query, [userId]);

    const visited = rows
      .filter((row) => row.status_id === 2)
      .map((row) => row.country_name);

    const wanted = rows
      .filter((row) => row.status_id === 1)
      .map((row) => row.country_name);

    res.status(200).json({ visited, wanted });
  } catch (error) {
    res.status(500).json({ error: "Error fetching travel list" });
  }
});

// POST - Lägg land till travellist
app.post("/api/travellist", async (req: Request, res: Response) => {
  const { country_id, status_id, user_id }: TravelList = req.body;

  try {
    const existing = await client.query(
      "SELECT * FROM travellist WHERE user_id = $1 AND country_id = $2",
      [user_id, country_id]
    );

    //PUT-UPDATE Status
    if (existing.rows.length > 0) {
      const updateResult = await client.query(
        "UPDATE travellist SET status_id = $1 WHERE user_id = $2 AND country_id = $3 RETURNING *;",
        [status_id, user_id, country_id]
      );

      res.status(200).json({
        message: "Country updated in travel list successfully",
        updatedItem: updateResult.rows[0],
      });
    } else {
      const query = `
      INSERT INTO travellist (country_id, status_id, user_id)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
      const values = [country_id, status_id, user_id];
      const insertResult = await client.query<TravelList>(query, values);
      res.status(201).json({
        message: "Country added to travel list successfully",
        newItem: insertResult.rows[0],
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Error adding country to the travellist" });
  }
});

// DELETE - Ta bort ett land från travellist
app.delete("/api/travellist", async (req: Request, res: Response) => {
  const { country_name } = req.body;
  try {
    // Hitta country_id
    const countryResult = await client.query(
      `SELECT country_id FROM countries WHERE country_name = $1`,
      [country_name]
    );

    const countryId = countryResult.rows[0].country_id;
    const deleteResult = await client.query(
      `DELETE FROM travellist
         WHERE country_id = $1
         RETURNING *`,
      [countryId]
    );

    if (deleteResult.rowCount === 0) {
      res.status(404).json({ error: "No matching entry found in travellist" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// EJ ANVÄNDS
// Hämta länder från API och Hook. ANVÄNT FÖR ATT SKAPA COUNTRIES.JSON
app.post("/api/savecountries", async (req: Request, res: Response) => {
  const newCountries = req.body;
  try {
    // Read the file
    const data = fs.existsSync("countries.json")
      ? fs.readFileSync("countries.json", "utf8")
      : "[]";
    // If the file contains data, parse it; otherwise, create an empty array
    const existingCountries = data ? JSON.parse(data) : [];
    // Add new countries to the existing list
    const updatedCountries = [...existingCountries, ...newCountries];
    // Update the JSON file
    fs.writeFileSync(
      "countries.json",
      JSON.stringify(updatedCountries, null, 2),
      "utf8"
    );

    for (const country of newCountries) {
      const {
        country_name,
        country_description,
        country_capital,
        country_population,
        country_continent,
        country_language,
        country_currency,
        country_flag,
      } = country;

      const query = `
          INSERT INTO countries (country_name, country_description, country_capital, country_population, country_continent, country_language, country_currency, country_flag)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING *;
        `;
      const values = [
        country_name,
        country_description,
        country_capital,
        country_population,
        country_continent,
        country_language,
        country_currency,
        country_flag,
      ];
      await client.query(query, values);
    }

    console.log("All countries have been processed.");
    res.status(200).send("Data successfully saved");
  } catch (error) {
    res.status(500).send({ error: "Error adding countries:" });
  }
});

// Serve frontend files
app.use(express.static(path.join(path.resolve(), "dist")));
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server kör på http://localhost:${port}`);
});
