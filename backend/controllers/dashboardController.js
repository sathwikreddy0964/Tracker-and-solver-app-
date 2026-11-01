const Task = require('../models/Task');
const Problem = require('../models/Problem');

// @desc    Get dashboard metrics & recent items for logged in user
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Task counts
    const [
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      totalProblems,
      solvedProblems,
      openProblems,
      inProgressProblems,
      recentTasks,
      recentProblems,
    ] = await Promise.all([
      Task.countDocuments({ user: userId }),
      Task.countDocuments({ user: userId, status: 'pending' }),
      Task.countDocuments({ user: userId, status: 'in-progress' }),
      Task.countDocuments({ user: userId, status: 'completed' }),
      Problem.countDocuments({ user: userId }),
      Problem.countDocuments({ user: userId, status: 'Solved' }),
      Problem.countDocuments({ user: userId, status: 'Open' }),
      Problem.countDocuments({ user: userId, status: 'In Progress' }),
      Task.find({ user: userId }).sort({ createdAt: -1 }).limit(5),
      Problem.find({ user: userId }).sort({ createdAt: -1 }).limit(5),
    ]);

    const taskCompletionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const problemSolveRate =
      totalProblems > 0 ? Math.round((solvedProblems / totalProblems) * 100) : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
        totalProblems,
        solvedProblems,
        openProblems,
        inProgressProblems,
        taskCompletionRate,
        problemSolveRate,
        recentTasks,
        recentProblems,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get progress tracking analytics (daily, weekly, monthly, categories)
// @route   GET /api/dashboard/progress
// @access  Private
const getProgressStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Tasks completed by timeframes
    const [
      tasksCompletedToday,
      tasksCompletedThisWeek,
      tasksCompletedThisMonth,
      problemsSolvedToday,
      problemsSolvedThisWeek,
      problemsSolvedThisMonth,
      allUserTasks,
      allUserProblems,
    ] = await Promise.all([
      Task.countDocuments({
        user: userId,
        status: 'completed',
        completedAt: { $gte: startOfToday },
      }),
      Task.countDocuments({
        user: userId,
        status: 'completed',
        completedAt: { $gte: startOfWeek },
      }),
      Task.countDocuments({
        user: userId,
        status: 'completed',
        completedAt: { $gte: startOfMonth },
      }),
      Problem.countDocuments({
        user: userId,
        status: 'Solved',
        solvedAt: { $gte: startOfToday },
      }),
      Problem.countDocuments({
        user: userId,
        status: 'Solved',
        solvedAt: { $gte: startOfWeek },
      }),
      Problem.countDocuments({
        user: userId,
        status: 'Solved',
        solvedAt: { $gte: startOfMonth },
      }),
      Task.find({ user: userId }).select('priority status dueDate createdAt'),
      Problem.find({ user: userId }).select('category severity status createdAt'),
    ]);

    // Priority distribution
    const priorityDistribution = {
      Low: 0,
      Medium: 0,
      High: 0,
    };
    allUserTasks.forEach((t) => {
      if (priorityDistribution[t.priority] !== undefined) {
        priorityDistribution[t.priority]++;
      }
    });

    // Category distribution for problems
    const categoryDistribution = {};
    allUserProblems.forEach((p) => {
      categoryDistribution[p.category] = (categoryDistribution[p.category] || 0) + 1;
    });

    // Calculate weekly task completion trend (last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

      const tasksDone = allUserTasks.filter(
        (t) => t.status === 'completed' && t.completedAt >= dayStart && t.completedAt <= dayEnd
      ).length;

      const tasksCreated = allUserTasks.filter(
        (t) => t.createdAt >= dayStart && t.createdAt <= dayEnd
      ).length;

      last7Days.push({
        day: dayLabel,
        created: tasksCreated,
        completed: tasksDone,
      });
    }

    res.status(200).json({
      success: true,
      progress: {
        daily: {
          tasksCompleted: tasksCompletedToday,
          problemsSolved: problemsSolvedToday,
        },
        weekly: {
          tasksCompleted: tasksCompletedThisWeek,
          problemsSolved: problemsSolvedThisWeek,
        },
        monthly: {
          tasksCompleted: tasksCompletedThisMonth,
          problemsSolved: problemsSolvedThisMonth,
        },
        priorityDistribution,
        categoryDistribution,
        last7Days,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getProgressStats,
};
