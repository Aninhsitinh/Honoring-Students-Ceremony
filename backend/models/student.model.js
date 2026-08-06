const prisma = require('../config/database');

const Student = {
  async findAll({ semester_id, achievement_type, search, limit = 50, offset = 0 }) {
    const where = {};
    if (semester_id) where.semester_id = parseInt(semester_id);
    if (achievement_type) where.achievement_type = achievement_type;
    if (search) {
      where.OR = [
        { full_name: { contains: search, mode: 'insensitive' } },
        { department: { contains: search, mode: 'insensitive' } },
        { student_code: { contains: search, mode: 'insensitive' } }
      ];
    }

    const students = await prisma.student.findMany({
      where,
      include: {
        semester: {
          select: { name: true, year: true }
        }
      },
      orderBy: [
        { sort_order: 'asc' },
        { created_at: 'desc' }
      ],
      take: parseInt(limit),
      skip: parseInt(offset)
    });

    return students.map(s => ({
      ...s,
      semester_name: s.semester?.name,
      semester_year: s.semester?.year
    }));
  },

  async count({ semester_id, achievement_type, search }) {
    const where = {};
    if (semester_id) where.semester_id = parseInt(semester_id);
    if (achievement_type) where.achievement_type = achievement_type;
    if (search) {
      where.OR = [
        { full_name: { contains: search, mode: 'insensitive' } },
        { department: { contains: search, mode: 'insensitive' } },
        { student_code: { contains: search, mode: 'insensitive' } }
      ];
    }

    return await prisma.student.count({ where });
  },

  async findById(id) {
    const student = await prisma.student.findUnique({
      where: { id: parseInt(id) },
      include: {
        semester: {
          select: { name: true, year: true }
        }
      }
    });

    if (!student) return null;

    return {
      ...student,
      semester_name: student.semester?.name,
      semester_year: student.semester?.year
    };
  },

  async findByCodeAndSemester(student_code, semester_id) {
    return await prisma.student.findFirst({
      where: {
        student_code,
        semester_id: parseInt(semester_id)
      }
    });
  },

  async create({ full_name, student_code, department, avatar_url, description, achievement_type, semester_id, sort_order }) {
    return await prisma.student.create({
      data: {
        full_name,
        student_code,
        department,
        avatar_url,
        description,
        achievement_type,
        semester_id: semester_id ? parseInt(semester_id) : null,
        sort_order: sort_order ? parseInt(sort_order) : 0
      }
    });
  },

  async update(id, { full_name, student_code, department, avatar_url, description, achievement_type, semester_id, sort_order }) {
    return await prisma.student.update({
      where: { id: parseInt(id) },
      data: {
        full_name,
        student_code,
        department,
        avatar_url,
        description,
        achievement_type,
        semester_id: semester_id ? parseInt(semester_id) : null,
        sort_order: sort_order ? parseInt(sort_order) : 0
      }
    });
  },

  async delete(id) {
    return await prisma.student.delete({
      where: { id: parseInt(id) }
    });
  },

  async deleteMany(ids) {
    return await prisma.student.deleteMany({
      where: { id: { in: ids.map(id => parseInt(id)) } }
    });
  }
};

module.exports = Student;
