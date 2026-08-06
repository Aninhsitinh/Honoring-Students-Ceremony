const Student = require('../models/student.model');
const TopScore = require('../models/topScore.model');
const { broadcast } = require('../utils/sse');
const { deleteCloudinaryImage } = require('../utils/cloudinary');

const DEPARTMENTS = {
  GCS: [
    'Công nghệ thông tin',
    'Trí tuệ nhân tạo và Khoa học dữ liệu',
    'Trí tuệ nhân tạo và An ninh mạng'
  ],
  GBS: [
    'Quản trị Kinh doanh',
    'Quản trị Marketing',
    'Quản trị Sự kiện',
    'Quản trị Truyền thông',
    'Kinh doanh quốc tế',
    'Logistics và Quản trị Chuỗi cung ứng'
  ],
  GDS: [
    'Thiết kế đồ họa & kỹ thuật số',
    'Truyền thông đa phương tiện'
  ]
};

function validateStudentCode(code, department) {
  if (!code || !department) return false;
  let expectedPrefix = null;
  const deptLower = department.toLowerCase().trim();
  
  for (const [prefix, majors] of Object.entries(DEPARTMENTS)) {
    if (majors.some(m => m.toLowerCase().trim() === deptLower)) {
      expectedPrefix = prefix;
      break;
    }
  }
  if (!expectedPrefix) return false; // Unknown department

  const regex = new RegExp(`^${expectedPrefix}\\d{6}$`, 'i');
  return regex.test(code.trim());
}

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
      res.status(500).json({ message: 'error.server' });
    }
  },

  async getById(req, res) {
    try {
      const student = await Student.findById(req.params.id);
      if (!student) {
        return res.status(404).json({ message: 'error.student.not_found' });
      }
      // Also get top scores for this student
      const topScores = await TopScore.findByStudentId(student.id);
      res.json({ ...student, top_scores: topScores });
    } catch (error) {
      console.error('Get student error:', error);
      res.status(500).json({ message: 'error.server' });
    }
  },

  async create(req, res) {
    try {
      const { full_name, student_code, department, description, achievement_type, semester_id, sort_order } = req.body;
      let avatar_url = req.body.avatar_url || null;

      if (!validateStudentCode(student_code, department)) {
        return res.status(400).json({ message: 'error.student.invalid_code' });
      }

      if (req.file) {
        avatar_url = req.file.path;
      }

      const existingStudent = await Student.findByCodeAndSemester(student_code, semester_id);
      if (existingStudent) {
        return res.status(409).json({ message: 'error.student.already_exists' });
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
      broadcast('students_updated', { action: 'create', semester_id });
      res.status(201).json(student);
    } catch (error) {
      console.error('Create student error:', error);
      res.status(500).json({ message: 'error.server' });
    }
  },

  async update(req, res) {
    try {
      const { full_name, student_code, department, description, achievement_type, semester_id, sort_order } = req.body;
      let avatar_url = req.body.avatar_url || null;

      if (!validateStudentCode(student_code, department)) {
        return res.status(400).json({ message: 'error.student.invalid_code' });
      }

      if (req.file) {
        avatar_url = req.file.path;
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
        return res.status(404).json({ message: 'error.student.not_found' });
      }
      broadcast('students_updated', { action: 'update', semester_id });
      res.json(student);
    } catch (error) {
      console.error('Update student error:', error);
      res.status(500).json({ message: 'error.server' });
    }
  },

  async importExcel(req, res) {
    try {
      const { students } = req.body;
      if (!students || !Array.isArray(students)) {
        return res.status(400).json({ message: 'error.invalid_data' });
      }

      let successCount = 0;
      for (const row of students) {
        const { full_name, student_code, department, achievement_type, description, semester_id, subject_name, score } = row;
        if (!full_name || !student_code || !department) continue;

        const codePattern = /^(GCS|GBS|GDS)\d{6}$/;
        if (!codePattern.test(student_code)) continue;

        // check if student exists
        let student = await Student.findByCodeAndSemester(student_code, semester_id);
        if (!student) {
          student = await Student.create({
            full_name, student_code, department, achievement_type, description, semester_id, sort_order: 0
          });
        }

        // if subject_name and score provided, add TopScore
        if (subject_name && score != null) {
          // Check if TopScore already exists to avoid duplicates
          const TopScore = require('../models/topScore.model');
          const existingScores = await TopScore.findAll({ student_id: student.id, semester_id });
          const alreadyHasScore = existingScores.some(ts => ts.subject_name.toLowerCase() === subject_name.toLowerCase());
          
          if (!alreadyHasScore) {
            await TopScore.create({
              student_id: student.id,
              subject_name,
              score,
              semester_id
            });
          }
        }
        successCount++;
      }
      
      broadcast('students');
      res.json({ message: 'Success', imported: successCount });
    } catch (error) {
      console.error('Import error:', error);
      res.status(500).json({ message: 'error.server' });
    }
  },

  async delete(req, res) {
    try {
      const student = await Student.delete(req.params.id);
      if (!student) return res.status(404).json({ message: 'error.student.not_found' });
      
      if (student.avatar_url) {
        await deleteCloudinaryImage(student.avatar_url);
      }

      broadcast('students');
      res.json({ message: 'admin.delete_success', student });
    } catch (error) {
      console.error('Delete student error:', error);
      res.status(500).json({ message: 'error.server' });
    }
  },

  bulkDelete: require('../utils/catchAsync')(async (req, res) => {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'error.invalid_data' });
    }
    
    // Fetch students to delete their images
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const studentsToDelete = await prisma.student.findMany({
      where: { id: { in: ids.map(id => parseInt(id)) } }
    });

    const result = await Student.deleteMany(ids);
    
    // Cleanup Cloudinary
    for (const student of studentsToDelete) {
      if (student.avatar_url) {
        await deleteCloudinaryImage(student.avatar_url);
      }
    }

    broadcast('students');
    res.json({ message: 'admin.delete_success', count: result.count });
  })
};

module.exports = studentController;
