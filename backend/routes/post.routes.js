const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', postController.getAll);
router.get('/slug/:slug', postController.getBySlug);
router.get('/:id', postController.getById);

// Admin routes
router.post('/', auth, upload.single('thumbnail'), postController.create);
router.put('/:id', auth, upload.single('thumbnail'), postController.update);
router.delete('/:id', auth, postController.delete);

module.exports = router;
