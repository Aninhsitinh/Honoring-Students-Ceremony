require('dotenv').config();
const { pool } = require('./config/database');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadToCloudinary(localPath) {
  try {
    const result = await cloudinary.uploader.upload(localPath, {
      folder: 'honoring_students'
    });
    return result.secure_url;
  } catch (err) {
    console.error('Error uploading to Cloudinary:', localPath, err.message);
    return null;
  }
}

async function migrate() {
  console.log('Starting image migration to Cloudinary...');
  const client = await pool.connect();
  
  try {
    // 1. Students
    console.log('Migrating Students...');
    const students = await client.query(`SELECT id, avatar_url FROM students WHERE avatar_url LIKE '/uploads/%'`);
    for (const row of students.rows) {
      const localPath = path.join(__dirname, row.avatar_url);
      if (fs.existsSync(localPath)) {
        console.log(`Uploading student ${row.id} avatar...`);
        const url = await uploadToCloudinary(localPath);
        if (url) {
          await client.query('UPDATE students SET avatar_url = $1 WHERE id = $2', [url, row.id]);
          console.log(`Updated student ${row.id}`);
        }
      } else {
        console.log(`File not found: ${localPath}`);
      }
    }

    // 2. Posts
    console.log('\nMigrating Posts...');
    const posts = await client.query(`SELECT id, thumbnail_url FROM posts WHERE thumbnail_url LIKE '/uploads/%'`);
    for (const row of posts.rows) {
      const localPath = path.join(__dirname, row.thumbnail_url);
      if (fs.existsSync(localPath)) {
        console.log(`Uploading post ${row.id} thumbnail...`);
        const url = await uploadToCloudinary(localPath);
        if (url) {
          await client.query('UPDATE posts SET thumbnail_url = $1 WHERE id = $2', [url, row.id]);
          console.log(`Updated post ${row.id}`);
        }
      } else {
        console.log(`File not found: ${localPath}`);
      }
    }

    // 3. Semesters
    console.log('\nMigrating Semesters...');
    const semesters = await client.query(`SELECT id, bg_image FROM semesters WHERE bg_image LIKE '/uploads/%'`);
    for (const row of semesters.rows) {
      const localPath = path.join(__dirname, row.bg_image);
      if (fs.existsSync(localPath)) {
        console.log(`Uploading semester ${row.id} background...`);
        const url = await uploadToCloudinary(localPath);
        if (url) {
          await client.query('UPDATE semesters SET bg_image = $1 WHERE id = $2', [url, row.id]);
          console.log(`Updated semester ${row.id}`);
        }
      } else {
        console.log(`File not found: ${localPath}`);
      }
    }

    console.log('\nMigration complete!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    client.release();
    pool.end();
  }
}

migrate();
