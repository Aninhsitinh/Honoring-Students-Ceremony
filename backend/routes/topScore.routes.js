const express = require('express');
const router = express.Router();
const topScoreController = require('../controllers/topScore.controller');
const auth = require('../middleware/auth');

// Public routes
router.get('/', topScoreController.getAll);
router.get('/subjects', topScoreController.getSubjects);
router.get('/:id', topScoreController.getById);

// Admin routes
router.post('/', auth, topScoreController.create);
router.put('/:id', auth, topScoreController.update);
router.delete('/:id', auth, topScoreController.delete);

module.exports = router;
