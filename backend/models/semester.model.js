const prisma = require('../config/database');

const Semester = {
  async findAll() {
    return await prisma.semester.findMany({
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

  async findActive() {
    return await prisma.semester.findFirst({
      where: { is_active: true },
      orderBy: { year: 'desc' }
    });
  },

  async create({ name, year, slug, description, is_active = false, bg_image = null, theme_color = null }) {
    if (is_active) {
      await prisma.semester.updateMany({
        where: { is_active: true },
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
        theme_color
      }
    });
  },

  async update(id, { name, year, slug, description, is_active, bg_image, theme_color }) {
    if (is_active) {
      await prisma.semester.updateMany({
        where: { is_active: true, id: { not: id } },
        data: { is_active: false }
      });
    }
    return await prisma.semester.update({
      where: { id },
      data: {
        name,
        year,
        slug,
        description,
        is_active,
        bg_image,
        theme_color
      }
    });
  },

  async delete(id) {
    return await prisma.semester.delete({
      where: { id }
    });
  },
};

module.exports = Semester;
