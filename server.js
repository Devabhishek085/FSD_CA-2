require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const feedbackRoutes = require("./routesFeedback");

const app = express();
app.use(express.json());

app.use("/api/feedback", feedbackRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, message: "Invalid JSON body" });
  }
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: "Validation failed", errors });
  }
  console.error(err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

const PORT = Number(process.env.PORT) || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/feedbackdb";

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      const fallbackPort = port + 1;
      console.warn(`Port ${port} is already in use. Retrying on port ${fallbackPort}...`);
      startServer(fallbackPort);
      return;
    }

    throw error;
  });
};

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    startServer(PORT);
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });