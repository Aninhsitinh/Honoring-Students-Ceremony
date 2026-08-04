const db = require('../config/database');

const User = {
  async findByUsername(username) {
    const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
  },

  async findById(id) {
    const result = await db.query('SELECT id, username, email, role, created_at FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },

  async create({ username, email, password_hash, role = 'admin' }) {
    const result = await db.query(
      'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role',
      [username, email, password_hash, role]
    );
    return result.rows[0];
  },
};

module.exports = User;
