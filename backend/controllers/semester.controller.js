const Semester = require('../models/semester.model');
const slugify = require('slugify');
const { deleteCloudinaryImage } = require('../utils/cloudinary');

const semesterController = {
  async getAll(req, res) {
    try {
      const { campus } = req.query;
      const semesters = await Semester.findAll(campus);
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
      const { campus } = req.query;
      const semester = await Semester.findActive(campus);
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

      // If Admin has a specific campus (not ALL), force create for their campus
      const campus = (req.user && req.user.campus !== 'ALL') ? req.user.campus : (req.body.campus || 'HN');

      const semester = await Semester.create({ name, year, slug, description, is_active, bg_image, campus });
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

      const current = await Semester.findById(req.params.id);
      if (!current) {
        return res.status(404).json({ message: 'error.semester.not_found' });
      }
      if (req.user && req.user.campus !== 'ALL' && current.campus !== req.user.campus) {
        return res.status(403).json({ message: 'error.auth.forbidden' });
      }

      const campus = (req.user && req.user.campus !== 'ALL') ? req.user.campus : req.body.campus;

      const semester = await Semester.update(req.params.id, { name, year, slug, description, is_active, bg_image, campus });
      res.json(semester);
    } catch (error) {
      console.error('Update semester error:', error);
      res.status(500).json({ message: 'error.server' });
    }
  },

  async delete(req, res) {
    try {
      const current = await Semester.findById(req.params.id);
      if (!current) {
        return res.status(404).json({ message: 'error.semester.not_found' });
      }
      if (req.user && req.user.campus !== 'ALL' && current.campus !== req.user.campus) {
        return res.status(403).json({ message: 'error.auth.forbidden' });
      }

      const semester = await Semester.delete(req.params.id);
      if (semester.bg_image) {
        await deleteCloudinaryImage(semester.bg_image);
      }
      res.json({ message: 'semester.deleted', semester });
    } catch (error) {
      console.error('Delete semester error:', error);
      res.status(500).json({ message: 'error.server' });
    }
  },
};

module.exports = semesterController;
