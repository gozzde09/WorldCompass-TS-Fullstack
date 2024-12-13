import cors from "cors";
import { Client } from "pg";
import * as dotenv from "dotenv";
import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { Country } from "./types/interfaces";
import { User } from "./types/interfaces";
import { Status } from "./types/interfaces";
import { TravelList } from "./types/interfaces";

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

const client = new Client({
  connectionString: process.env.PGURI,
});
client.connect();

// ----- USERS -----
// GET - users
app.get("/api/users", async (_req: Request, res: Response) => {
  try {
    const { rows } = await client.query<User>(`SELECT * FROM users`);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json(error + "Error fetching users");
  }
});

// POST - Login
app.post("/api/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const query = "SELECT * FROM users WHERE email = $1";
    const { rows } = await client.query(query, [email]);
    const user = rows[0];

    await bcrypt.compare(password, user.password);
    const token = jwt.sign({ userId: user.user_id }, "my_jwt_secret", {
      expiresIn: "1h",
    });

    res.json({
      message: "Login successful",
      token,
      user: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST-REGISTER user
app.post("/api/users", async (req: Request, res: Response) => {
  const { first_name, last_name, email, password }: User = req.body;

  try {
    const query = `
      INSERT INTO users (first_name, last_name, email, password)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING
      RETURNING *;
    `;
    const values = [first_name, last_name, email, password];
    const { rows } = await client.query<User>(query, values);
    const user = rows[0];
    const token = jwt.sign({ userId: user.user_id }, "my_jwt_secret", {
      expiresIn: "1h",
    });
    if (rows.length === 0) {
      res.status(409).json({ error: "Email already exists" });
    }

    res.status(201).send({
      message: "Registering successfull",
      user: user,
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error adding user" });
  }
});

// ----- COUNTRIES -----
//Insert Into Countries från JSON file
app.post("/api/savecountries", async (req: Request, res: Response) => {
  const newCountries = req.body;

  try {
    // Read the existing JSON file
    const data = fs.existsSync("countries.json")
      ? fs.readFileSync("countries.json", "utf8")
      : "[]";

    // Parse the existing data or initialize an empty array
    const existingCountries = data ? JSON.parse(data) : [];
    const updatedCountries = [...existingCountries, ...newCountries];

    // Write the updated countries to the JSON file
    fs.writeFileSync(
      "countries.json",
      JSON.stringify(updatedCountries, null, 2),
      "utf8"
    );

    res.status(200).send("Data successfully saved to file");
  } catch (error) {
    console.error("Error saving to file:", error);
    res.status(500).send("An error occurred while saving to file");
  }
  insertDataFromFile();
});

// Read and insert data from countries.json into the database
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
        } else {
          console.log(`Inserted: ${country.country_name}`);
        }
      });
    });
  });
};

// Insert data when server starts
//insertDataFromFile();

console.log("Data successfully inserted into the database");

// GET - länder
app.get("/api/countries", async (_req: Request, res: Response) => {
  try {
    const { rows } = await client.query<Country>(`SELECT * FROM countries`);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json(error + "Error fetching countries");
  }
});

// GET - ett land
app.get("/api/countries/:name", async (req: Request, res: Response) => {
  const { name } = req.params;
  // console.log(name);
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

// ----- VISIT-STATUS -----
// GET -visitstatus
app.get("/api/visitstatus", async (_req: Request, res: Response) => {
  try {
    const { rows } = await client.query<Country>(`SELECT * FROM visitstatus`);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json(error + "Error fetching visitstatus");
  }
});

// ----- TRAVEL-LIST -----
// GET - travellist med alla tabeller
app.get("/api/travellist", async (_req: Request, res: Response) => {
  try {
    const { rows } = await client.query<TravelList>(
      `SELECT
          travellist.travellist_id,
          users.first_name,
          countries.country_name,
          visitstatus.status_name
      FROM travellist
      JOIN users ON travellist.user_id = users.user_id
      JOIN countries ON travellist.country_id = countries.country_id
      JOIN visitstatus ON travellist.status_id = visitstatus.status_id;`
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json(error + "Error fetching travel list");
  }
});

// POST - Lägg land till travellist
app.post("/api/travellist", async (req: Request, res: Response) => {
  const { country_id, status_id, user_id }: TravelList = req.body;
  try {
    const query = `
      INSERT INTO travellist (country_id, status_id, user_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [country_id, status_id, user_id];
    const { rows } = await client.query<TravelList>(query, values);
    res.status(201).send(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error adding country to the travellist" });
  }
});

// PUT - Uppdatera status i travellist
app.put(
  "/api/travellist/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const { status_id }: Status = req.body;

    try {
      const { rows } = await client.query<TravelList>(
        "UPDATE travellist SET status_id = $1 WHERE travellist_id  = $2 RETURNING *",
        [status_id, id]
      );
      res.status(200).send(rows[0]);
    } catch (error) {
      res
        .status(500)
        .json(error + "Error updating the visitstatus in the travellist");
    }
  }
);

// DELETE - Ta bort ett land från travellist
app.delete(
  "/api/travellist/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;

    try {
      await client.query<TravelList>(
        `DELETE FROM travellist WHERE travellist_id = $1 RETURNING *`,
        [id]
      );
      res.status(204).send();
    } catch (error) {
      res
        .status(500)
        .json(error + "Error deleting the country from the travellist");
    }
  }
);

// Serve frontend files
app.use(express.static(path.join(path.resolve(), "dist")));
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server kör på http://localhost:${port}`);
});
