const Subject = require('../models/subject.model');

const subjectController = {
  async getAll(req, res) {
    try {
      const { department } = req.query;
      const subjects = await Subject.findAll(department);
      res.json(subjects);
    } catch (error) {
      console.error('Get subjects error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  async create(req, res) {
    try {
      const { code, name, department } = req.body;
      if (!code || !name || !department) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
      }
      const subject = await Subject.create({ code, name, department });
      res.status(201).json(subject);
    } catch (error) {
      console.error('Create subject error:', error);
      if (error.code === '23505') { // unique violation
        return res.status(400).json({ message: 'Mã môn học này đã tồn tại trong chuyên ngành' });
      }
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  async update(req, res) {
    try {
      const { code, name, department } = req.body;
      const subject = await Subject.update(req.params.id, { code, name, department });
      if (!subject) return res.status(404).json({ message: 'Không tìm thấy môn học' });
      res.json(subject);
    } catch (error) {
      console.error('Update subject error:', error);
      if (error.code === '23505') {
        return res.status(400).json({ message: 'Mã môn học này đã tồn tại trong chuyên ngành' });
      }
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  async delete(req, res) {
    try {
      const subject = await Subject.delete(req.params.id);
      if (!subject) return res.status(404).json({ message: 'Không tìm thấy môn học' });
      res.json({ message: 'Đã xóa môn học', subject });
    } catch (error) {
      console.error('Delete subject error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  }
};

module.exports = subjectController;
