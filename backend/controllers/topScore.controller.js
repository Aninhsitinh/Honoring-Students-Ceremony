const TopScore = require('../models/topScore.model');
const { broadcast } = require('../utils/sse');

const topScoreController = {
  async getAll(req, res) {
    try {
      const { semester_id, subject_name } = req.query;
      const topScores = await TopScore.findAll({ semester_id, subject_name });
      res.json(topScores);
    } catch (error) {
      console.error('Get top scores error:', error);
      res.status(500).json({ message: 'error.server' });
    }
  },

  async getSubjects(req, res) {
    try {
      const { semester_id } = req.query;
      const subjects = await TopScore.getSubjects(semester_id);
      res.json(subjects);
    } catch (error) {
      console.error('Get subjects error:', error);
      res.status(500).json({ message: 'error.server' });
    }
  },

  async getById(req, res) {
    try {
      const topScore = await TopScore.findById(req.params.id);
      if (!topScore) {
        return res.status(404).json({ message: 'error.not_found' });
      }
      res.json(topScore);
    } catch (error) {
      console.error('Get top score error:', error);
      res.status(500).json({ message: 'error.server' });
    }
  },

  async create(req, res) {
    try {
      const { student_id, subject_name, score, semester_id } = req.body;
      const topScore = await TopScore.create({ student_id, subject_name, score, semester_id });
      broadcast('top_scores_updated', { action: 'create', semester_id });
      res.status(201).json(topScore);
    } catch (error) {
      console.error('Create top score error:', error);
      res.status(500).json({ message: 'error.server' });
    }
  },

  async update(req, res) {
    try {
      const { student_id, subject_name, score, semester_id } = req.body;
      const topScore = await TopScore.update(req.params.id, { student_id, subject_name, score, semester_id });
      if (!topScore) {
        return res.status(404).json({ message: 'error.not_found' });
      }
      broadcast('top_scores_updated', { action: 'update', semester_id });
      res.json(topScore);
    } catch (error) {
      console.error('Update top score error:', error);
      res.status(500).json({ message: 'error.server' });
    }
  },

  async delete(req, res) {
    try {
      const topScore = await TopScore.delete(req.params.id);
      if (!topScore) {
        return res.status(404).json({ message: 'error.not_found' });
      }
      broadcast('top_scores_updated', { action: 'delete' });
      res.json({ message: 'topscore.deleted', topScore });
    } catch (error) {
      console.error('Delete top score error:', error);
      res.status(500).json({ message: 'error.server' });
    }
  },
};

module.exports = topScoreController;
