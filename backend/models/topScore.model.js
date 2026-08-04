const db = require('../config/database');

const TopScore = {
  async findAll({ semester_id, subject_name }) {
    let query = `
      SELECT ts.*, s.full_name, s.student_code, s.department, s.avatar_url,
             sem.name as semester_name, sem.year as semester_year
      FROM top_scores ts
      JOIN students s ON ts.student_id = s.id
      LEFT JOIN semesters sem ON ts.semester_id = sem.id
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (semester_id) {
      query += ` AND ts.semester_id = $${paramIndex++}`;
      params.push(semester_id);
    }
    if (subject_name) {
      query += ` AND ts.subject_name ILIKE $${paramIndex++}`;
      params.push(`%${subject_name}%`);
    }

    query += ' ORDER BY ts.score DESC, ts.subject_name ASC';
    const result = await db.query(query, params);
    return result.rows;
  },

  async findById(id) {
    const result = await db.query(
      `SELECT ts.*, s.full_name, s.student_code, s.department
       FROM top_scores ts
       JOIN students s ON ts.student_id = s.id
       WHERE ts.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async findByStudentId(studentId) {
    const result = await db.query(
      'SELECT * FROM top_scores WHERE student_id = $1 ORDER BY score DESC',
      [studentId]
    );
    return result.rows;
  },

  async getSubjects(semester_id) {
    let query = 'SELECT DISTINCT subject_name FROM top_scores';
    const params = [];
    if (semester_id) {
      query += ' WHERE semester_id = $1';
      params.push(semester_id);
    }
    query += ' ORDER BY subject_name';
    const result = await db.query(query, params);
    return result.rows.map((r) => r.subject_name);
  },

  async create({ student_id, subject_name, score, semester_id }) {
    const result = await db.query(
      'INSERT INTO top_scores (student_id, subject_name, score, semester_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [student_id, subject_name, score, semester_id]
    );
    return result.rows[0];
  },

  async update(id, { student_id, subject_name, score, semester_id }) {
    const result = await db.query(
      'UPDATE top_scores SET student_id = $1, subject_name = $2, score = $3, semester_id = $4 WHERE id = $5 RETURNING *',
      [student_id, subject_name, score, semester_id, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await db.query('DELETE FROM top_scores WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },
};

module.exports = TopScore;
