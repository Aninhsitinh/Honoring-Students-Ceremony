const express = require('express');
const router = express.Router();
const semesterController = require('../controllers/semester.controller');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { cacheMiddleware } = require('../utils/cache');

// Public routes
router.get('/', cacheMiddleware, semesterController.getAll);
router.get('/active', cacheMiddleware, semesterController.getActive);
router.get('/:id', cacheMiddleware, semesterController.getById);

// Admin routes
router.post('/', auth, upload.single('bg_image'), semesterController.create);
router.put('/:id', auth, upload.single('bg_image'), semesterController.update);
router.delete('/:id', auth, semesterController.delete);

module.exports = router;
