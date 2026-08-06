const Semester = require('../models/semester.model');
const slugify = require('slugify');

const semesterController = {
  async getAll(req, res) {
    try {
      const semesters = await Semester.findAll();
      res.json(semesters);
    } catch (error) {
      console.error('Get semesters error:', error);
      res.status(500).json({ message: 'error.server' });
    }
  },

  async getById(req, res) {
    try {
      const semester = await Semester.findById(req.params.id);
      if (!semester) {
        return res.status(404).json({ message: 'error.semester.not_found' });
      }
      res.json(semester);
    } catch (error) {
      console.error('Get semester error:', error);
      res.status(500).json({ message: 'error.server' });
    }
  },

  async getActive(req, res) {
    try {
      const semester = await Semester.findActive();
      if (!semester) {
        return res.status(404).json({ message: 'error.semester.no_active' });
      }
      res.json(semester);
    } catch (error) {
      console.error('Get active semester error:', error);
      res.status(500).json({ message: 'error.server' });
    }
  },

  async create(req, res) {
    try {
      const { name, year, description, is_active } = req.body;
      const slug = slugify(`${name}-${year}`, { lower: true, locale: 'vi' });
      const bg_image = req.file ? req.file.path : null;

      const existing = await Semester.findBySlug(slug);
      if (existing) {
        return res.status(400).json({ message: 'error.semester.exists' });
      }

      const semester = await Semester.create({ name, year, slug, description, is_active, bg_image });
      res.status(201).json(semester);
    } catch (error) {
      console.error('Create semester error:', error);
      res.status(500).json({ message: 'error.server' });
    }
  },

  async update(req, res) {
    try {
      const { name, year, description, is_active } = req.body;
      const slug = slugify(`${name}-${year}`, { lower: true, locale: 'vi' });
      const bg_image = req.file ? req.file.path : req.body.bg_image;

      const semester = await Semester.update(req.params.id, { name, year, slug, description, is_active, bg_image });
      if (!semester) {
        return res.status(404).json({ message: 'error.semester.not_found' });
      }
      res.json(semester);
    } catch (error) {
      console.error('Update semester error:', error);
      res.status(500).json({ message: 'error.server' });
    }
  },

  async delete(req, res) {
    try {
      const semester = await Semester.delete(req.params.id);
      if (!semester) {
        return res.status(404).json({ message: 'error.semester.not_found' });
      }
      res.json({ message: 'semester.deleted', semester });
    } catch (error) {
      console.error('Delete semester error:', error);
      res.status(500).json({ message: 'error.server' });
    }
  },
};

module.exports = semesterController;
