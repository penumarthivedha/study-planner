require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); 

const { notFound, errorHandler } = require("./middleware/errorHandler");
 const app = express();
 const PORT = 5000;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", require("./routes/tasks")); 

app.get("/", (req, res) => {
  res.send("Study Planner backend is running!");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "This is JSON", status: "ok" });
});

app.post("/api/echo", (req, res) => {
  const { name } = req.body;
  res.status(201).json({ message: `Hello, ${name}` });
});

app.use(notFound);
app.use(errorHandler);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed:", err.message);
  });