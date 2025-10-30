import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';

import connectToDB from "./db/db.js";
import userRoute  from "./routes/user.route.js";

dotenv.config();

const app = express();

connectToDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/users", userRoute)

export default app;
