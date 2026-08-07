const prisma = require('../config/database');

const Post = {
  async findAll({ semester_id, is_published, campus, limit = 20, offset = 0 }) {
    const where = {};
    if (semester_id) where.semester_id = parseInt(semester_id);
    if (campus && campus !== 'ALL') where.campus = campus;
    if (is_published !== undefined) {
      // is_published could be a string 'true'/'false' or boolean
      where.is_published = is_published === 'true' || is_published === true;
    }

    const posts = await prisma.post.findMany({
      where,
      include: {
        author: { select: { username: true } },
        semester: { select: { name: true, year: true } }
      },
      orderBy: [
        { published_at: 'desc' },
        { created_at: 'desc' }
      ],
      take: parseInt(limit),
      skip: parseInt(offset)
    });

    return posts.map(p => ({
      ...p,
      author_name: p.author?.username,
      semester_name: p.semester?.name,
      semester_year: p.semester?.year
    }));
  },

  async count({ semester_id, is_published, campus }) {
    const where = {};
    if (semester_id) where.semester_id = parseInt(semester_id);
    if (campus && campus !== 'ALL') where.campus = campus;
    if (is_published !== undefined) {
      where.is_published = is_published === 'true' || is_published === true;
    }

    return await prisma.post.count({ where });
  },

  async findById(id) {
    const p = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: { select: { username: true } },
        semester: { select: { name: true, year: true } }
      }
    });

    if (!p) return null;

    return {
      ...p,
      author_name: p.author?.username,
      semester_name: p.semester?.name,
      semester_year: p.semester?.year
    };
  },

  async findBySlug(slug) {
    const p = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: { select: { username: true } },
        semester: { select: { name: true, year: true } }
      }
    });

    if (!p) return null;

    return {
      ...p,
      author_name: p.author?.username,
      semester_name: p.semester?.name,
      semester_year: p.semester?.year
    };
  },

  async create({ title, slug, content, thumbnail_url, author_id, semester_id, is_published, campus = 'HN' }) {
    const isPub = is_published === 'true' || is_published === true;
    return await prisma.post.create({
      data: {
        title,
        slug,
        content,
        thumbnail_url,
        author_id: author_id ? parseInt(author_id) : null,
        semester_id: semester_id ? parseInt(semester_id) : null,
        is_published: isPub,
        published_at: isPub ? new Date() : null,
        updated_at: new Date(),
        campus
      }
    });
  },

  async update(id, { title, slug, content, thumbnail_url, semester_id, is_published, campus }) {
    const isPub = is_published === 'true' || is_published === true;
    
    // Fetch existing post to check current published_at state
    const existing = await prisma.post.findUnique({ where: { id: parseInt(id) } });
    
    let published_at = existing?.published_at;
    if (isPub && !published_at) {
      published_at = new Date();
    } else if (!isPub) {
      published_at = null;
    }

    return await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        title,
        slug,
        content,
        thumbnail_url,
        semester_id: semester_id ? parseInt(semester_id) : null,
        is_published: isPub,
        published_at,
        updated_at: new Date(),
        campus
      }
    });
  },

  async delete(id) {
    return await prisma.post.delete({
      where: { id: parseInt(id) }
    });
  },
};

module.exports = Post;
