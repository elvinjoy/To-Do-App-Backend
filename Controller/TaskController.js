const Task = require('../Model/TaskModel');

// Create a task
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    // Field validation one by one
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    if (!description) {
      return res.status(400).json({ message: 'Description is required' });
    }
    if (!priority) {
      return res.status(400).json({ message: 'Priority is required' });
    }

    const allowedPriorities = ['high', 'medium', 'low'];
    if (!allowedPriorities.includes(priority.toLowerCase())) {
      return res.status(400).json({
        message: 'Priority must be High, Medium, or Low',
      });
    }

    // Create the task
    const task = await Task.create({
      user: req.user.id,
      title,
      description,
      priority,
    });

    res.status(201).json({
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    console.error('Create Task Error:', error.message);
    if (error.code === 11000) {
      // Handle duplicate key errors (e.g., unique constraint violation)
      return res.status(400).json({ message: 'Duplicate task detected' });
    }
    res.status(500).json({ message: 'Failed to create task. Server error.' });
  }
};

// Get all tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: 'No tasks found' });
    }
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Get Tasks Error:', error.message);
    res.status(500).json({ message: 'Failed to retrieve tasks. Server error.' });
  }
};

// Update a specific task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { title, description, priority },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized access' });
    }

    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (error) {
    console.error('Update Task Error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Task ID format' });
    }
    res.status(500).json({ message: 'Failed to update task. Server error.' });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized access' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete Task Error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Task ID format' });
    }
    res.status(500).json({ message: 'Failed to delete task. Server error.' });
  }
};

// Toggle task status
exports.toggleTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({ _id: id, user: req.user.id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized access' });
    }

    task.status = !task.status; // Toggle status
    await task.save();

    res.status(200).json({ message: 'Task status updated', task });
  } catch (error) {
    console.error('Toggle Task Status Error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Task ID format' });
    }
    res.status(500).json({ message: 'Failed to toggle task status. Server error.' });
  }
};
