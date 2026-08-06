const Subject = require('../models/subject.model');

// Danh sách chuyên ngành chuẩn – dùng để normalize hoa/thường từ phía client
const CANONICAL_DEPARTMENTS = [
  'Công nghệ thông tin',
  'Trí tuệ nhân tạo và Khoa học dữ liệu',
  'Trí tuệ nhân tạo và An ninh mạng',
  'Quản trị Kinh doanh',
  'Quản trị Marketing',
  'Quản trị Sự kiện',
  'Quản trị Truyền thông',
  'Kinh doanh quốc tế',
  'Logistics và Quản trị Chuỗi cung ứng',
  'Thiết kế đồ họa & kỹ thuật số',
  'Truyền thông đa phương tiện',
];

function normalizeDepartment(raw) {
  if (!raw) return raw;
  const trimmed = raw.trim();
  const found = CANONICAL_DEPARTMENTS.find(
    d => d.toLowerCase() === trimmed.toLowerCase()
  );
  return found || trimmed; // nếu không khớp thì giữ nguyên
}

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
      const { code, name } = req.body;
      const department = normalizeDepartment(req.body.department);
      if (!code || !name || !department) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
      }
      const subject = await Subject.create({ code: code.trim(), name: name.trim(), department });
      res.status(201).json(subject);
    } catch (error) {
      if (error.code === '23505' || error.code === 'P2002') { // unique violation
        return res.status(400).json({ message: 'Mã môn học này đã tồn tại trong chuyên ngành' });
      }
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  async update(req, res) {
    try {
      const { code, name } = req.body;
      const department = normalizeDepartment(req.body.department);
      const subject = await Subject.update(req.params.id, { code: code?.trim(), name: name?.trim(), department });
      if (!subject) return res.status(404).json({ message: 'Không tìm thấy môn học' });
      res.json(subject);
    } catch (error) {
      if (error.code === '23505' || error.code === 'P2002') {
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
