const Student = require('../models/student.model');
const TopScore = require('../models/topScore.model');

const studentController = {
  async getAll(req, res) {
    try {
      const { semester_id, achievement_type, search, limit = 50, offset = 0 } = req.query;
      const students = await Student.findAll({
        semester_id,
        achievement_type,
        search,
        limit: parseInt(limit),
        offset: parseInt(offset),
      });
      const total = await Student.count({ semester_id, achievement_type, search });
      res.json({ students, total, limit: parseInt(limit), offset: parseInt(offset) });
    } catch (error) {
      console.error('Get students error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  async getById(req, res) {
    try {
      const student = await Student.findById(req.params.id);
      if (!student) {
        return res.status(404).json({ message: 'Không tìm thấy sinh viên' });
      }
      // Also get top scores for this student
      const topScores = await TopScore.findByStudentId(student.id);
      res.json({ ...student, top_scores: topScores });
    } catch (error) {
      console.error('Get student error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  async create(req, res) {
    try {
      const { full_name, student_code, department, description, achievement_type, semester_id, sort_order } = req.body;
      let avatar_url = req.body.avatar_url || null;

      if (req.file) {
        avatar_url = `/uploads/${req.file.filename}`;
      }

      const student = await Student.create({
        full_name,
        student_code,
        department,
        avatar_url,
        description,
        achievement_type: achievement_type || 'excellent',
        semester_id,
        sort_order,
      });
      res.status(201).json(student);
    } catch (error) {
      console.error('Create student error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  async update(req, res) {
    try {
      const { full_name, student_code, department, description, achievement_type, semester_id, sort_order } = req.body;
      let avatar_url = req.body.avatar_url || null;

      if (req.file) {
        avatar_url = `/uploads/${req.file.filename}`;
      }

      // If no new avatar, keep the old one
      if (!avatar_url) {
        const existing = await Student.findById(req.params.id);
        avatar_url = existing?.avatar_url;
      }

      const student = await Student.update(req.params.id, {
        full_name,
        student_code,
        department,
        avatar_url,
        description,
        achievement_type,
        semester_id,
        sort_order,
      });

      if (!student) {
        return res.status(404).json({ message: 'Không tìm thấy sinh viên' });
      }
      res.json(student);
    } catch (error) {
      console.error('Update student error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  async delete(req, res) {
    try {
      const student = await Student.delete(req.params.id);
      if (!student) {
        return res.status(404).json({ message: 'Không tìm thấy sinh viên' });
      }
      res.json({ message: 'Đã xóa sinh viên', student });
    } catch (error) {
      console.error('Delete student error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
};

module.exports = studentController;
