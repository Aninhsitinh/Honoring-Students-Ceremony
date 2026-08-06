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
      res.status(500).json({ message: 'error.server' });
    }
  },

  async create(req, res) {
    try {
      const { code, name } = req.body;
      const department = normalizeDepartment(req.body.department);
      if (!code || !name || !department) {
        return res.status(400).json({ message: 'error.subject.missing_info' });
      }

      const existing = await Subject.findByCode(code);
      if (existing && existing.department === department) {
        return res.status(400).json({ message: 'error.subject.exists' });
      }

      const subject = await Subject.create({ code, name, department });
      res.status(201).json(subject);
    } catch (error) {
      console.error('Create subject error:', error);
      res.status(500).json({ message: 'error.server' });
    }
  },

  async update(req, res) {
    try {
      const { code, name } = req.body;
      const department = normalizeDepartment(req.body.department);
      const subject = await Subject.findById(req.params.id);
      
      if (!subject) return res.status(404).json({ message: 'error.subject.not_found' });

      if (code && code !== subject.code) {
        const existing = await Subject.findByCode(code);
        if (existing && existing.department === department) {
          return res.status(400).json({ message: 'error.subject.exists' });
        }
      }

      const updated = await Subject.update(req.params.id, { code, name, department });
      res.json(updated);
    } catch (error) {
      console.error('Update subject error:', error);
      res.status(500).json({ message: 'error.server' });
    }
  },

  async delete(req, res) {
    try {
      const subject = await Subject.delete(req.params.id);
      if (!subject) return res.status(404).json({ message: 'error.subject.not_found' });
      res.json({ message: 'admin.delete_success', subject });
    } catch (error) {
      console.error('Delete subject error:', error);
      res.status(500).json({ message: 'error.server' });
    }
  },

  bulkDelete: require('../utils/catchAsync')(async (req, res) => {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Invalid data' });
    }
    const result = await Subject.deleteMany(ids);
    res.json({ message: 'admin.delete_success', count: result.count });
  })
};

module.exports = subjectController;
