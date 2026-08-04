const db = require('../config/database');

const Student = {
  async findAll({ semester_id, achievement_type, search, limit = 50, offset = 0 }) {
    let query = `
      SELECT s.*, sem.name as semester_name, sem.year as semester_year
      FROM students s
      LEFT JOIN semesters sem ON s.semester_id = sem.id
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (semester_id) {
      query += ` AND s.semester_id = $${paramIndex++}`;
      params.push(semester_id);
    }

    if (achievement_type) {
      query += ` AND s.achievement_type = $${paramIndex++}`;
      params.push(achievement_type);
    }

    if (search) {
      query += ` AND (s.full_name ILIKE $${paramIndex} OR s.department ILIKE $${paramIndex} OR s.student_code ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ` ORDER BY s.sort_order ASC, s.created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);

    const result = await db.query(query, params);
    return result.rows;
  },

  async count({ semester_id, achievement_type, search }) {
    let query = 'SELECT COUNT(*) FROM students WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (semester_id) {
      query += ` AND semester_id = $${paramIndex++}`;
      params.push(semester_id);
    }
    if (achievement_type) {
      query += ` AND achievement_type = $${paramIndex++}`;
      params.push(achievement_type);
    }
    if (search) {
      query += ` AND (full_name ILIKE $${paramIndex} OR department ILIKE $${paramIndex} OR student_code ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    const result = await db.query(query, params);
    return parseInt(result.rows[0].count);
  },

  async findById(id) {
    const result = await db.query(
      `SELECT s.*, sem.name as semester_name, sem.year as semester_year
       FROM students s
       LEFT JOIN semesters sem ON s.semester_id = sem.id
       WHERE s.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async create({ full_name, student_code, department, avatar_url, description, achievement_type, semester_id, sort_order }) {
    const result = await db.query(
      `INSERT INTO students (full_name, student_code, department, avatar_url, description, achievement_type, semester_id, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [full_name, student_code, department, avatar_url, description, achievement_type, semester_id, sort_order || 0]
    );
    return result.rows[0];
  },

  async update(id, { full_name, student_code, department, avatar_url, description, achievement_type, semester_id, sort_order }) {
    const result = await db.query(
      `UPDATE students SET full_name = $1, student_code = $2, department = $3, avatar_url = $4,
       description = $5, achievement_type = $6, semester_id = $7, sort_order = $8
       WHERE id = $9 RETURNING *`,
      [full_name, student_code, department, avatar_url, description, achievement_type, semester_id, sort_order || 0, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await db.query('DELETE FROM students WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },
};

module.exports = Student;
