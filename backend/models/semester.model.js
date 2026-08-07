const prisma = require('../config/database');

const Semester = {
  async findAll(campus) {
    const where = campus && campus !== 'ALL' ? { campus } : {};
    return await prisma.semester.findMany({
      where,
      orderBy: [
        { year: 'desc' },
        { id: 'desc' }
      ]
    });
  },

  async findById(id) {
    return await prisma.semester.findUnique({
      where: { id }
    });
  },

  async findBySlug(slug) {
    return await prisma.semester.findUnique({
      where: { slug }
    });
  },

  async findActive(campus) {
    const where = { is_active: true };
    if (campus && campus !== 'ALL') {
      where.campus = campus;
    }
    return await prisma.semester.findFirst({
      where,
      orderBy: { year: 'desc' }
    });
  },

  async create({ name, year, slug, description, is_active = false, bg_image = null, theme_color = null, campus = 'HN' }) {
    if (is_active) {
      await prisma.semester.updateMany({
        where: { is_active: true, campus },
        data: { is_active: false }
      });
    }
    return await prisma.semester.create({
      data: {
        name,
        year,
        slug,
        description,
        is_active,
        bg_image,
        theme_color,
        campus
      }
    });
  },

  async update(id, { name, year, slug, description, is_active, bg_image, theme_color, campus }) {
    if (is_active) {
      const current = await this.findById(id);
      const targetCampus = campus || current.campus;
      await prisma.semester.updateMany({
        where: { is_active: true, campus: targetCampus },
        data: { is_active: false }
      });
    }
    const data = { name, year, slug, description, is_active, bg_image, theme_color };
    if (campus !== undefined) {
      data.campus = campus;
    }
    return await prisma.semester.update({
      where: { id },
      data
    });
  },

  async delete(id) {
    return await prisma.semester.delete({
      where: { id }
    });
  },
};

module.exports = Semester;
