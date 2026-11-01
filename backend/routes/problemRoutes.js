const express = require('express');
const router = express.Router();
const {
  createProblem,
  getProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
  addSolution,
  markProblemSolved,
} = require('../controllers/problemController');
const { protect } = require('../middleware/auth');

router.use(protect); // All problem routes are protected

router.route('/')
  .post(createProblem)
  .get(getProblems);

router.route('/:id')
  .get(getProblemById)
  .put(updateProblem)
  .delete(deleteProblem);

router.post('/:id/solutions', addSolution);
router.patch('/:id/solve', markProblemSolved);

module.exports = router;
