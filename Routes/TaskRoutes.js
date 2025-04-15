const express = require("express");
const router = express.Router();
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  toggleTaskStatus,
} = require("../Controller/TaskController");
const { protect } = require("../middleware/auth");

router.post("/create", protect, createTask);
router.get("/alltasks", protect, getTasks);
router.put("/tasks/:id", protect, updateTask);
router.delete("/tasks/:id", protect, deleteTask);
router.patch("/tasks/:id/status", protect, toggleTaskStatus);

module.exports = router;
