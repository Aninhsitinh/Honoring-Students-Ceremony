const Post = require('../models/post.model');
const slugify = require('slugify');
const { deleteCloudinaryImage } = require('../utils/cloudinary');
const { clearCache } = require('../utils/cache');

const postController = {
  async getAll(req, res) {
    try {
      const { semester_id, is_published, campus, limit = 20, offset = 0 } = req.query;
      const posts = await Post.findAll({
        semester_id,
        campus,
        is_published: is_published !== undefined ? is_published === 'true' : undefined,
        limit: parseInt(limit),
        offset: parseInt(offset),
      });
      const total = await Post.count({
        semester_id,
        campus,
        is_published: is_published !== undefined ? is_published === 'true' : undefined,
      });
      res.json({ posts, total, limit: parseInt(limit), offset: parseInt(offset) });
    } catch (error) {
      console.error('Get posts error:', error);
      res.status(500).json({ message: 'error.server' });
    }
  },

  async getById(req, res) {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: 'error.post.not_found' });
      }
      res.json(post);
    } catch (error) {
      console.error('Get post error:', error);
      res.status(500).json({ message: 'error.server' });
    }
  },

  async getBySlug(req, res) {
    try {
      const post = await Post.findBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: 'error.post.not_found' });
      }
      res.json(post);
    } catch (error) {
      console.error('Get post by slug error:', error);
      res.status(500).json({ message: 'error.server' });
    }
  },

  async create(req, res) {
    try {
      const { title, content, semester_id, is_published } = req.body;
      let thumbnail_url = req.body.thumbnail_url || null;

      if (req.file) {
        thumbnail_url = req.file.path;
      }

      const baseSlug = slugify(title, { lower: true, locale: 'vi', strict: true });
      const slug = `${baseSlug}-${Date.now()}`;

      const campus = (req.user && req.user.campus !== 'ALL') ? req.user.campus : (req.body.campus || 'HN');

      const post = await Post.create({
        title,
        slug,
        content,
        thumbnail_url,
        author_id: req.user.id,
        semester_id,
        is_published: is_published === 'true' || is_published === true,
        campus
      });
      clearCache('/api/posts');
      res.status(201).json(post);
    } catch (error) {
      console.error('Create post error:', error);
      res.status(500).json({ message: 'error.server' });
    }
  },

  async update(req, res) {
    try {
      const { title, content, semester_id, is_published } = req.body;
      let thumbnail_url = req.body.thumbnail_url || null;

      if (req.file) {
        thumbnail_url = req.file.path;
      }

      if (!thumbnail_url) {
        const existing = await Post.findById(req.params.id);
        thumbnail_url = existing?.thumbnail_url;
      }

      const slug = slugify(title, { lower: true, locale: 'vi', strict: true }) + '-' + Date.now();

      const current = await Post.findById(req.params.id);
      if (!current) {
        return res.status(404).json({ message: 'error.post.not_found' });
      }
      if (req.user && req.user.campus !== 'ALL' && current.campus !== req.user.campus) {
        return res.status(403).json({ message: 'error.auth.forbidden' });
      }

      const campus = (req.user && req.user.campus !== 'ALL') ? req.user.campus : req.body.campus;

      const post = await Post.update(req.params.id, {
        title,
        slug,
        content,
        thumbnail_url,
        semester_id,
        is_published: is_published === 'true' || is_published === true,
        campus
      });

      if (!post) {
        return res.status(404).json({ message: 'error.post.not_found' });
      }
      clearCache('/api/posts');
      res.json(post);
    } catch (error) {
      console.error('Update post error:', error);
      res.status(500).json({ message: 'error.server' });
    }
  },

  async delete(req, res) {
    try {
      const current = await Post.findById(req.params.id);
      if (!current) {
        return res.status(404).json({ message: 'error.post.not_found' });
      }
      if (req.user && req.user.campus !== 'ALL' && current.campus !== req.user.campus) {
        return res.status(403).json({ message: 'error.auth.forbidden' });
      }

      const post = await Post.delete(req.params.id);
      if (post.thumbnail_url) {
        await deleteCloudinaryImage(post.thumbnail_url);
      }
      clearCache('/api/posts');
      res.json({ message: 'post.deleted', post });
    } catch (error) {
      console.error('Delete post error:', error);
      res.status(500).json({ message: 'error.server' });
    }
  },
};

module.exports = postController;
