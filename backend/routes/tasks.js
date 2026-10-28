const express = require("express");
const auth = require("../middleware/auth");
const Task = require("../models/Task");

const router = express.Router();

// every route in this file requires a valid token
router.use(auth);

// POST /api/tasks  -> add a task
router.post("/", async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }
    const task = await Task.create({ user: req.userId, title });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

// GET /api/tasks  -> list my tasks (newest first)
router.get("/", async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/tasks/:id  -> mark done (or not done)
router.patch("/:id", async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.userId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    task.done = typeof req.body.done === "boolean" ? req.body.done : !task.done;
    await task.save();
    res.json(task);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/tasks/:id  -> delete a task
router.delete("/:id", async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;