const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Trust the first proxy (required on Render, Railway, Heroku, etc.)
// Without this, express-rate-limit throws ERR_ERL_UNEXPECTED_X_FORWARDED_FOR
app.set('trust proxy', 1);

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
app.use(cookieParser());

// Rate limiter for API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3000, // increased to allow bulk imports from admin dashboard (1 request per row)
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

// Global Error Handler
const globalErrorHandler = require('./middleware/error');
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Start background jobs
  const setupBackupJob = require('./jobs/backup');
  setupBackupJob();
});
