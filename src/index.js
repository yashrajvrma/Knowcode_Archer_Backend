import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import translateRouter from "./routes/translate.route.js"; // Assuming your translation routes are here

dotenv.config();

const app = express();

app.use(cors()); // Enable CORS for all routes

// Middleware for JSON parsing
app.use(express.json());

// Add an options preflight handler for all routes
app.options("*", cors());

// Test route
app.get("/test", (req, res) => {
  res.send("Test API is working");
});

// Use translation routes
app.use("/api/translate", translateRouter);

const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
