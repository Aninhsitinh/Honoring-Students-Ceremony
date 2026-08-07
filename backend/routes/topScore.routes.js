const express = require('express');
const router = express.Router();
const topScoreController = require('../controllers/topScore.controller');
const auth = require('../middleware/auth');
const { cacheMiddleware } = require('../utils/cache');

// Public routes
router.get('/', cacheMiddleware, topScoreController.getAll);
router.get('/subjects', cacheMiddleware, topScoreController.getSubjects);
router.get('/:id', cacheMiddleware, topScoreController.getById);

// Admin routes
router.post('/', auth, topScoreController.create);
router.put('/:id', auth, topScoreController.update);
router.delete('/:id', auth, topScoreController.delete);

module.exports = router;
