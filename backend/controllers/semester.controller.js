const Semester = require('../models/semester.model');
const slugify = require('slugify');

const semesterController = {
  async getAll(req, res) {
    try {
      const semesters = await Semester.findAll();
      res.json(semesters);
    } catch (error) {
      console.error('Get semesters error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  async getById(req, res) {
    try {
      const semester = await Semester.findById(req.params.id);
      if (!semester) {
        return res.status(404).json({ message: 'Không tìm thấy kỳ học' });
      }
      res.json(semester);
    } catch (error) {
      console.error('Get semester error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  async getActive(req, res) {
    try {
      const semester = await Semester.findActive();
      if (!semester) {
        return res.status(404).json({ message: 'Không có kỳ học đang hoạt động' });
      }
      res.json(semester);
    } catch (error) {
      console.error('Get active semester error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  async create(req, res) {
    try {
      const { name, year, description, is_active } = req.body;
      const slug = slugify(`${name}-${year}`, { lower: true, locale: 'vi' });

      const existing = await Semester.findBySlug(slug);
      if (existing) {
        return res.status(400).json({ message: 'Kỳ học này đã tồn tại' });
      }

      const semester = await Semester.create({ name, year, slug, description, is_active });
      res.status(201).json(semester);
    } catch (error) {
      console.error('Create semester error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  async update(req, res) {
    try {
      const { name, year, description, is_active } = req.body;
      const slug = slugify(`${name}-${year}`, { lower: true, locale: 'vi' });

      const semester = await Semester.update(req.params.id, { name, year, slug, description, is_active });
      if (!semester) {
        return res.status(404).json({ message: 'Không tìm thấy kỳ học' });
      }
      res.json(semester);
    } catch (error) {
      console.error('Update semester error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  async delete(req, res) {
    try {
      const semester = await Semester.delete(req.params.id);
      if (!semester) {
        return res.status(404).json({ message: 'Không tìm thấy kỳ học' });
      }
      res.json({ message: 'Đã xóa kỳ học', semester });
    } catch (error) {
      console.error('Delete semester error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
};

module.exports = semesterController;
