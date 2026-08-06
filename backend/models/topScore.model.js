const prisma = require('../config/database');

const TopScore = {
  async findAll({ semester_id, subject_name }) {
    const where = {};
    if (semester_id) where.semester_id = parseInt(semester_id);
    if (subject_name) {
      where.subject_name = {
        contains: subject_name,
        mode: 'insensitive'
      };
    }

    const topScores = await prisma.topScore.findMany({
      where,
      include: {
        student: {
          select: { full_name: true, student_code: true, department: true, avatar_url: true }
        },
        semester: {
          select: { name: true, year: true }
        }
      },
      orderBy: [
        { score: 'desc' },
        { subject_name: 'asc' }
      ]
    });

    return topScores.map(ts => ({
      ...ts,
      full_name: ts.student?.full_name,
      student_code: ts.student?.student_code,
      department: ts.student?.department,
      avatar_url: ts.student?.avatar_url,
      semester_name: ts.semester?.name,
      semester_year: ts.semester?.year,
      score: parseFloat(ts.score) // Prisma returns Decimal objects
    }));
  },

  async findById(id) {
    const ts = await prisma.topScore.findUnique({
      where: { id: parseInt(id) },
      include: {
        student: {
          select: { full_name: true, student_code: true, department: true }
        }
      }
    });

    if (!ts) return null;

    return {
      ...ts,
      full_name: ts.student?.full_name,
      student_code: ts.student?.student_code,
      department: ts.student?.department,
      score: parseFloat(ts.score)
    };
  },

  async findByStudentId(studentId) {
    const scores = await prisma.topScore.findMany({
      where: { student_id: parseInt(studentId) },
      orderBy: { score: 'desc' }
    });
    return scores.map(s => ({ ...s, score: parseFloat(s.score) }));
  },

  async getSubjects(semester_id) {
    const where = semester_id ? { semester_id: parseInt(semester_id) } : {};
    
    // Prisma doesn't have a direct DISTINCT over a single column that returns a flat array easily.
    // groupBy is the equivalent.
    const grouped = await prisma.topScore.groupBy({
      by: ['subject_name'],
      where,
      orderBy: { subject_name: 'asc' }
    });
    
    return grouped.map(g => g.subject_name);
  },

  async create({ student_id, subject_name, score, semester_id }) {
    const ts = await prisma.topScore.create({
      data: {
        student_id: student_id ? parseInt(student_id) : null,
        subject_name,
        score,
        semester_id: semester_id ? parseInt(semester_id) : null
      }
    });
    return { ...ts, score: parseFloat(ts.score) };
  },

  async update(id, { student_id, subject_name, score, semester_id }) {
    const ts = await prisma.topScore.update({
      where: { id: parseInt(id) },
      data: {
        student_id: student_id ? parseInt(student_id) : null,
        subject_name,
        score,
        semester_id: semester_id ? parseInt(semester_id) : null
      }
    });
    return { ...ts, score: parseFloat(ts.score) };
  },

  async delete(id) {
    const ts = await prisma.topScore.delete({
      where: { id: parseInt(id) }
    });
    return { ...ts, score: parseFloat(ts.score) };
  },
};

module.exports = TopScore;
