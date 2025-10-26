import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectToDB from "./db/db.js";

dotenv.config();

const app = express();

connectToDB();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
