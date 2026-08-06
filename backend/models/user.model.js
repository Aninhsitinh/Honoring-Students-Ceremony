const prisma = require('../config/database');

const User = {
  async findByUsername(username) {
    return await prisma.user.findUnique({
      where: { username }
    });
  },

  async findById(id) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        created_at: true
      }
    });
  },

  async create({ username, email, password_hash, role = 'admin' }) {
    return await prisma.user.create({
      data: {
        username,
        email,
        password_hash,
        role
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true
      }
    });
  },
};

module.exports = User;
