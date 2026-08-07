const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { cacheMiddleware } = require('../utils/cache');

// Public routes
router.get('/', cacheMiddleware, studentController.getAll);
router.get('/:id', cacheMiddleware, studentController.getById);

// Admin routes
router.post('/import', auth, studentController.importExcel);
router.post('/', auth, upload.single('avatar'), studentController.create);
router.put('/:id', auth, upload.single('avatar'), studentController.update);
router.post('/bulk-delete', auth, studentController.bulkDelete);
router.delete('/:id', auth, studentController.delete);

module.exports = router;
