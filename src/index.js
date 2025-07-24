import express from "express";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import routes from "./routes/index.js";
import corsMiddleware from "./config/cors.js";
import sessionMiddleware from "./config/session.js";

dotenv.config();
connectDB();

const app = express();

app.use(corsMiddleware);

app.use(express.json());

app.use(sessionMiddleware);

app.use("/api", routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(` Server running on http://localhost:${PORT}`)
);
