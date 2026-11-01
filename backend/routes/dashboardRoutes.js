const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getProgressStats,
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.use(protect); // All dashboard routes are protected

router.get('/stats', getDashboardStats);
router.get('/progress', getProgressStats);

module.exports = router;
