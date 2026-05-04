const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// ─── GET /api/tasks/stats ─────────────────────────────────────────────────────
// Must be defined BEFORE /:id routes to avoid "stats" being treated as an id
router.get('/stats', async (req, res) => {
  try {
    const [total, completed, inProgress, todo, highPriority, overdue] =
      await Promise.all([
        Task.countDocuments(),
        Task.countDocuments({ status: 'completed' }),
        Task.countDocuments({ status: 'in-progress' }),
        Task.countDocuments({ status: 'todo' }),
        Task.countDocuments({ priority: 'high' }),
        Task.countDocuments({
          dueDate: { $lt: new Date() },
          status: { $ne: 'completed' },
        }),
      ]);

    // Priority breakdown
    const priorityBreakdown = await Task.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    // Category breakdown
    const categoryBreakdown = await Task.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]);

    // Tasks created over last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    const dailyTrend = await Task.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: {
        total,
        completed,
        inProgress,
        todo,
        highPriority,
        overdue,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
        priorityBreakdown,
        categoryBreakdown,
        dailyTrend,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /api/tasks ───────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { status, priority, category, search, sort = '-createdAt', limit = 100, page = 1 } = req.query;

    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (priority && priority !== 'all') filter.priority = priority;
    if (category && category !== 'all') filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [tasks, total] = await Promise.all([
      Task.find(filter).sort(sort).skip(skip).limit(Number(limit)),
      Task.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: tasks,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /api/tasks/:id ───────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── POST /api/tasks ──────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json({ success: true, data: task, message: 'Task created successfully' });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── PUT /api/tasks/:id ───────────────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task, message: 'Task updated successfully' });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── PATCH /api/tasks/:id/toggle ─────────────────────────────────────────────
router.patch('/:id/toggle', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    task.status = task.status === 'completed' ? 'todo' : 'completed';
    await task.save();
    res.json({ success: true, data: task, message: `Task marked as ${task.status}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── DELETE /api/tasks/:id ────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
