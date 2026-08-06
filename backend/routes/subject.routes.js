const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subject.controller');

router.get('/', subjectController.getAll);
router.post('/', subjectController.create);
router.put('/:id', subjectController.update);
router.post('/bulk-delete', subjectController.bulkDelete);
router.delete('/:id', subjectController.delete);

module.exports = router;
