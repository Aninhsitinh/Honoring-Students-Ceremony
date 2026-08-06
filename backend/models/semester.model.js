const db = require('../config/database');

const Semester = {
  async findAll() {
    const result = await db.query('SELECT * FROM semesters ORDER BY year DESC, id DESC');
    return result.rows;
  },

  async findById(id) {
    const result = await db.query('SELECT * FROM semesters WHERE id = $1', [id]);
    return result.rows[0];
  },

  async findBySlug(slug) {
    const result = await db.query('SELECT * FROM semesters WHERE slug = $1', [slug]);
    return result.rows[0];
  },

  async findActive() {
    const result = await db.query('SELECT * FROM semesters WHERE is_active = true ORDER BY year DESC LIMIT 1');
    return result.rows[0];
  },

  async create({ name, year, slug, description, is_active = false, bg_image = null }) {
    // If setting as active, deactivate others first
    if (is_active) {
      await db.query('UPDATE semesters SET is_active = false');
    }
    const result = await db.query(
      'INSERT INTO semesters (name, year, slug, description, is_active, bg_image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, year, slug, description, is_active, bg_image]
    );
    return result.rows[0];
  },

  async update(id, { name, year, slug, description, is_active, bg_image }) {
    if (is_active) {
      await db.query('UPDATE semesters SET is_active = false');
    }
    const result = await db.query(
      'UPDATE semesters SET name = $1, year = $2, slug = $3, description = $4, is_active = $5, bg_image = $6 WHERE id = $7 RETURNING *',
      [name, year, slug, description, is_active, bg_image, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await db.query('DELETE FROM semesters WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },
};

module.exports = Semester;
