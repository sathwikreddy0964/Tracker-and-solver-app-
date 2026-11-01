const Problem = require('../models/Problem');

// @desc    Record a new problem
// @route   POST /api/problems
// @access  Private
const createProblem = async (req, res, next) => {
  try {
    const { title, description, category, severity, initialSolution } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Problem title and description are required',
      });
    }

    const solutions = [];
    if (initialSolution && initialSolution.trim()) {
      solutions.push({
        solutionText: initialSolution.trim(),
        outcome: 'Attempted',
        recordedAt: new Date(),
      });
    }

    const problem = await Problem.create({
      user: req.user._id,
      title,
      description,
      category: category || 'Technical',
      severity: severity || 'Medium',
      status: 'Open',
      solutions,
    });

    res.status(201).json({
      success: true,
      message: 'Problem recorded successfully',
      problem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all problems for current user with filters
// @route   GET /api/problems
// @access  Private
const getProblems = async (req, res, next) => {
  try {
    const { status, category, severity, search, sortBy } = req.query;

    const query = { user: req.user._id };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (severity && severity !== 'all') {
      query.severity = severity;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOptions = { createdAt: -1 };
    if (sortBy === 'severity') {
      sortOptions = { severity: 1 };
    } else if (sortBy === 'updatedAt') {
      sortOptions = { updatedAt: -1 };
    }

    const problems = await Problem.find(query).sort(sortOptions);

    res.status(200).json({
      success: true,
      count: problems.length,
      problems,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get problem by ID
// @route   GET /api/problems/:id
// @access  Private
const getProblemById = async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    if (problem.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this problem' });
    }

    res.status(200).json({
      success: true,
      problem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update problem details
// @route   PUT /api/problems/:id
// @access  Private
const updateProblem = async (req, res, next) => {
  try {
    let problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    if (problem.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this problem' });
    }

    const { title, description, category, severity, status, resolutionNotes } = req.body;

    if (title !== undefined) problem.title = title;
    if (description !== undefined) problem.description = description;
    if (category !== undefined) problem.category = category;
    if (severity !== undefined) problem.severity = severity;
    if (status !== undefined) problem.status = status;
    if (resolutionNotes !== undefined) problem.resolutionNotes = resolutionNotes;

    const updatedProblem = await problem.save();

    res.status(200).json({
      success: true,
      message: 'Problem updated successfully',
      problem: updatedProblem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a problem
// @route   DELETE /api/problems/:id
// @access  Private
const deleteProblem = async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    if (problem.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this problem' });
    }

    await problem.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Problem deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a solution attempt to problem
// @route   POST /api/problems/:id/solutions
// @access  Private
const addSolution = async (req, res, next) => {
  try {
    const { solutionText, outcome } = req.body;

    if (!solutionText || !solutionText.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Solution text is required',
      });
    }

    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    if (problem.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this problem' });
    }

    const newSolution = {
      solutionText: solutionText.trim(),
      outcome: outcome || 'Attempted',
      recordedAt: new Date(),
    };

    problem.solutions.push(newSolution);

    // If solution was resolved, auto-update status
    if (outcome === 'Resolved' && problem.status !== 'Solved') {
      problem.status = 'Solved';
      problem.solvedAt = new Date();
    } else if (problem.status === 'Open') {
      problem.status = 'In Progress';
    }

    await problem.save();

    res.status(201).json({
      success: true,
      message: 'Solution recorded successfully',
      problem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark problem as solved with final notes
// @route   PATCH /api/problems/:id/solve
// @access  Private
const markProblemSolved = async (req, res, next) => {
  try {
    const { resolutionNotes } = req.body;

    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    if (problem.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this problem' });
    }

    problem.status = 'Solved';
    problem.solvedAt = new Date();
    if (resolutionNotes) {
      problem.resolutionNotes = resolutionNotes;
    }

    const updated = await problem.save();

    res.status(200).json({
      success: true,
      message: 'Problem marked as solved!',
      problem: updated,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProblem,
  getProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
  addSolution,
  markProblemSolved,
};
