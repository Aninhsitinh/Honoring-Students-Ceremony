const express = require('express');
const router = express.Router();
const semesterController = require('../controllers/semester.controller');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', semesterController.getAll);
router.get('/active', semesterController.getActive);
router.get('/:id', semesterController.getById);

// Admin routes
router.post('/', auth, upload.single('bg_image'), semesterController.create);
router.put('/:id', auth, upload.single('bg_image'), semesterController.update);
router.delete('/:id', auth, semesterController.delete);

module.exports = router;
