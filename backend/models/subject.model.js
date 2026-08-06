const db = require('../config/database');

const Subject = {
  async findAll(department = null) {
    let query = 'SELECT * FROM subjects';
    const params = [];
    if (department) {
      query += ' WHERE department = $1';
      params.push(department);
    }
    query += ' ORDER BY department ASC, name ASC';
    const result = await db.query(query, params);
    return result.rows;
  },

  async findById(id) {
    const result = await db.query('SELECT * FROM subjects WHERE id = $1', [id]);
    return result.rows[0];
  },

  async create({ code, name, department }) {
    const result = await db.query(
      `INSERT INTO subjects (code, name, department)
       VALUES ($1, $2, $3) RETURNING *`,
      [code, name, department]
    );
    return result.rows[0];
  },

  async update(id, { code, name, department }) {
    const result = await db.query(
      `UPDATE subjects SET code = $1, name = $2, department = $3
       WHERE id = $4 RETURNING *`,
      [code, name, department, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await db.query('DELETE FROM subjects WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};

module.exports = Subject;
