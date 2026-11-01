const User = require('../models/User');
const Task = require('../models/Task');
const Problem = require('../models/Problem');

// @desc    Get system-wide statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalAdmins,
      totalTasks,
      completedTasks,
      totalProblems,
      solvedProblems,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'admin' }),
      Task.countDocuments(),
      Task.countDocuments({ status: 'completed' }),
      Problem.countDocuments(),
      Problem.countDocuments({ status: 'Solved' }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalAdmins,
        totalTasks,
        completedTasks,
        totalProblems,
        solvedProblems,
        taskCompletionRate:
          totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        problemSolveRate:
          totalProblems > 0 ? Math.round((solvedProblems / totalProblems) * 100) : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with their statistics
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    // Populate task and problem counts for each user
    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const [taskCount, problemCount] = await Promise.all([
          Task.countDocuments({ user: u._id }),
          Problem.countDocuments({ user: u._id }),
        ]);
        return {
          ...u.toObject(),
          taskCount,
          problemCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: usersWithStats.length,
      users: usersWithStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a user's role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role value' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent revoking own admin access
    if (user._id.toString() === req.user._id.toString() && role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot revoke your own administrative privileges',
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user and cascade delete tasks & problems
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Admins cannot delete their own account from the admin dashboard',
      });
    }

    // Cascade delete user's data
    await Task.deleteMany({ user: user._id });
    await Problem.deleteMany({ user: user._id });
    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User and all associated data deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks across system
// @route   GET /api/admin/tasks
// @access  Private/Admin
const getAllTasksAdmin = async (req, res, next) => {
  try {
    const tasks = await Task.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all problems across system
// @route   GET /api/admin/problems
// @access  Private/Admin
const getAllProblemsAdmin = async (req, res, next) => {
  try {
    const problems = await Problem.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: problems.length,
      problems,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllTasksAdmin,
  getAllProblemsAdmin,
};
