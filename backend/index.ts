import cors from "cors";
import { Client } from "pg";
import * as dotenv from "dotenv";
import express, { Request, Response } from "express";
import path from "path";

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

  try {
    const query = `
      INSERT INTO users (first_name, last_name, email, password )
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [first_name, last_name, email, password];
    const { rows } = await client.query<User>(query, values);
    res.status(201).send(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error adding user" });
  }
});
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
  try {
    const result = await client.query(
      "SELECT * FROM countries WHERE country_name = $1",
      [name]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Country not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch country details" });
  }
});

// POST - Lägg till länder
app.post("/api/countries", async (req: Request, res: Response) => {
  const {
    country_name,
    country_description,
    country_capital,
    country_population,
    country_continent,
    country_language,
    country_currency,
    country_flag,
  }: Country = req.body;

  try {
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
    const { rows } = await client.query<Country>(query, values);
    res.status(201).send(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error adding countries" });
  }
});

// GET -visitstatus
app.get("/api/visitstatus", async (_req: Request, res: Response) => {
  try {
    const { rows } = await client.query<Country>(`SELECT * FROM visitstatus`);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json(error + "Error fetching visitstatus");
  }
});

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
