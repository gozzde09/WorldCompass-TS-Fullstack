import cors from "cors";
import { Client } from "pg";
import * as dotenv from "dotenv";
import express, { Request, Response } from "express";
import path from "path";

import { Country } from "./types/interfaces";
import { User } from "./types/interfaces";
import { Status } from "./types/interfaces";
import { BucketList } from "./types/interfaces";

const app = express();
app.use(express.json());
app.use(cors());
require("dotenv").config();

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
  }: Country = req.body;

  try {
    const query = `
      INSERT INTO countries (country_name, country_description, country_capital, country_population, country_continent, country_language, country_currency)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
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

// GET - bucketlist med alla tabeller
app.get("/api/bucketlist", async (_req: Request, res: Response) => {
  try {
    const { rows } = await client.query<BucketList>(
      `SELECT
          bucketlist.bucketlist_id,
          users.first_name,
          countries.country_name,
          visitstatus.status_name,
          bucketlist.notes
      FROM bucketList
      JOIN users ON bucketlist.user_id = users.user_id
      JOIN countries ON bucketlist.country_id = countries.country_id
      JOIN visitstatus ON bucketlist.status_id = visitstatus.status_id;`
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json(error + "Error fetching bucket list");
  }
});

// POST - Lägg land till bucketlist
app.post("/api/bucketlist", async (req: Request, res: Response) => {
  const { country_id, status_id, user_id, notes }: BucketList = req.body;
  try {
    const query = `
      INSERT INTO bucketlist (country_id, status_id, user_id, notes)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [country_id, status_id, user_id, notes];
    const { rows } = await client.query<BucketList>(query, values);
    res.status(201).send(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error adding country to the bucketlist" });
  }
});

// PUT - Uppdatera status i bucketlist
app.put(
  "/api/bucketlist/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const { status_id }: Status = req.body;

    try {
      const { rows } = await client.query<BucketList>(
        "UPDATE Bucketlist SET status_id = $1 WHERE bucketlist_id  = $2 RETURNING *",
        [status_id, id]
      );
      res.status(200).send(rows[0]);
    } catch (error) {
      res
        .status(500)
        .json(error + "Error updating the visitstatus in the bucketlist");
    }
  }
);

// DELETE - Ta bort ett land från bucketlist
app.delete(
  "/api/bucketlist/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;

    try {
      await client.query<BucketList>(
        `DELETE FROM Bucketlist WHERE bucketlist_id = $1 RETURNING *`,
        [id]
      );
      res.status(204).send();
    } catch (error) {
      res
        .status(500)
        .json(error + "Error deleting the country from the bucketlist");
    }
  }
);

// Serve frontend files
app.use(express.static(path.join(path.resolve(), "dist")));
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server kör på http://localhost:${port}`);
});
