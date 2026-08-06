const db = require('./database');
require('dotenv').config();

const migrate = async () => {
  try {
    console.log('🔄 Running database migrations...');

    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Table "users" created');

    await db.query(`
      CREATE TABLE IF NOT EXISTS semesters (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        year INTEGER NOT NULL,
        slug VARCHAR(50) UNIQUE NOT NULL,
        description TEXT,
        is_active BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Table "semesters" created');

    await db.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        student_code VARCHAR(20),
        department VARCHAR(100),
        avatar_url VARCHAR(500),
        description TEXT,
        achievement_type VARCHAR(50) DEFAULT 'excellent',
        semester_id INTEGER REFERENCES semesters(id) ON DELETE CASCADE,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Table "students" created');

    await db.query(`
      CREATE TABLE IF NOT EXISTS top_scores (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        subject_name VARCHAR(100) NOT NULL,
        score DECIMAL(5,2) NOT NULL,
        semester_id INTEGER REFERENCES semesters(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Table "top_scores" created');

    await db.query(`
      CREATE TABLE IF NOT EXISTS subjects (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) NOT NULL,
        name VARCHAR(150) NOT NULL,
        department VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(code, department)
      );
    `);
    console.log('✅ Table "subjects" created');

    await db.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        content TEXT NOT NULL,
        thumbnail_url VARCHAR(500),
        author_id INTEGER REFERENCES users(id),
        semester_id INTEGER REFERENCES semesters(id),
        is_published BOOLEAN DEFAULT false,
        published_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Table "posts" created');

    console.log('🎉 All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
};

migrate();
