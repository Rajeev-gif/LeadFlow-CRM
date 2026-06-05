require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// Import models to register them with mongoose

// Routes

const app = express();

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production" ? "" : "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);

// Middleware to parse JSON bodies
app.use(express.json());

connectDB();

// Routes

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
