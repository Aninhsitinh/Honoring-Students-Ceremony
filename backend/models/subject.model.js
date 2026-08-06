const prisma = require('../config/database');

const Subject = {
  async findAll(department = null) {
    return await prisma.subject.findMany({
      where: department ? { department } : {},
      orderBy: [
        { department: 'asc' },
        { name: 'asc' }
      ]
    });
  },

  async findById(id) {
    return await prisma.subject.findUnique({
      where: { id: parseInt(id) }
    });
  },

  async create({ code, name, department }) {
    return await prisma.subject.create({
      data: {
        code,
        name,
        department
      }
    });
  },

  async update(id, { code, name, department }) {
    return await prisma.subject.update({
      where: { id: parseInt(id) },
      data: {
        code,
        name,
        department
      }
    });
  },

  async delete(id) {
    return await prisma.subject.delete({
      where: { id: parseInt(id) }
    });
  }
};

module.exports = Subject;
