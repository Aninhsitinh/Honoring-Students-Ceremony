const db = require('../config/database');

const Post = {
  async findAll({ semester_id, is_published, limit = 20, offset = 0 }) {
    let query = `
      SELECT p.*, u.username as author_name, sem.name as semester_name, sem.year as semester_year
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN semesters sem ON p.semester_id = sem.id
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (semester_id) {
      query += ` AND p.semester_id = $${paramIndex++}`;
      params.push(semester_id);
    }
    if (is_published !== undefined) {
      query += ` AND p.is_published = $${paramIndex++}`;
      params.push(is_published);
    }

    query += ` ORDER BY p.published_at DESC NULLS LAST, p.created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);

    const result = await db.query(query, params);
    return result.rows;
  },

  async count({ semester_id, is_published }) {
    let query = 'SELECT COUNT(*) FROM posts WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (semester_id) {
      query += ` AND semester_id = $${paramIndex++}`;
      params.push(semester_id);
    }
    if (is_published !== undefined) {
      query += ` AND is_published = $${paramIndex++}`;
      params.push(is_published);
    }

    const result = await db.query(query, params);
    return parseInt(result.rows[0].count);
  },

  async findById(id) {
    const result = await db.query(
      `SELECT p.*, u.username as author_name, sem.name as semester_name, sem.year as semester_year
       FROM posts p
       LEFT JOIN users u ON p.author_id = u.id
       LEFT JOIN semesters sem ON p.semester_id = sem.id
       WHERE p.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async findBySlug(slug) {
    const result = await db.query(
      `SELECT p.*, u.username as author_name, sem.name as semester_name, sem.year as semester_year
       FROM posts p
       LEFT JOIN users u ON p.author_id = u.id
       LEFT JOIN semesters sem ON p.semester_id = sem.id
       WHERE p.slug = $1`,
      [slug]
    );
    return result.rows[0];
  },

  async create({ title, slug, content, thumbnail_url, author_id, semester_id, is_published }) {
    const published_at = is_published ? new Date() : null;
    const result = await db.query(
      `INSERT INTO posts (title, slug, content, thumbnail_url, author_id, semester_id, is_published, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [title, slug, content, thumbnail_url, author_id, semester_id, is_published || false, published_at]
    );
    return result.rows[0];
  },

  async update(id, { title, slug, content, thumbnail_url, semester_id, is_published }) {
    const published_at = is_published ? new Date() : null;
    const result = await db.query(
      `UPDATE posts SET title = $1, slug = $2, content = $3, thumbnail_url = $4,
       semester_id = $5, is_published = $6, published_at = COALESCE($7, published_at), updated_at = NOW()
       WHERE id = $8 RETURNING *`,
      [title, slug, content, thumbnail_url, semester_id, is_published, published_at, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await db.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },
};

module.exports = Post;
