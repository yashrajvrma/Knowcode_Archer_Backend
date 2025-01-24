import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import translateRouter from "./routes/translate.route.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());

app.get("/test", (req, res) => {
  res.send("Test API is working");
});

app.use("/api/translate", translateRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
