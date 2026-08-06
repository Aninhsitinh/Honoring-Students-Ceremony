const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false, // allow loading images/assets across origin
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiter for API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { message: 'Too many requests from this IP, please try again later.' }
});

// Apply rate limiter specifically to auth routes to prevent brute force
app.use('/api/auth/login', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, 
  message: { message: 'Too many login attempts from this IP, please try again later.' }
}));

// Apply general API rate limiter
app.use('/api/', apiLimiter);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/semesters', require('./routes/semester.routes'));
app.use('/api/students', require('./routes/student.routes'));
app.use('/api/top-scores', require('./routes/topScore.routes'));
app.use('/api/posts', require('./routes/post.routes'));
app.use('/api/subjects', require('./routes/subject.routes'));

// ─── Server-Sent Events (real-time updates) ───────────────────────────────────
const { addClient } = require('./utils/sse');
app.get('/api/events', (req, res) => {
  addClient(res);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File quá lớn. Tối đa 5MB.' });
  }
  if (err.message && err.message.includes('upload')) {
    return res.status(400).json({ message: err.message });
  }
  res.status(500).json({ message: 'Lỗi server nội bộ' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
});
