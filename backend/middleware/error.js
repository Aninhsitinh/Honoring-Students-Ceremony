const globalErrorHandler = (err, req, res, next) => {
  console.error('🔥 Global Error:', err);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'error.server';

  // Handle Prisma Unique Constraint Error
  if (err.code === 'P2002' || err.code === '23505') {
    statusCode = 400;
    message = 'error.validation.unique';
  }

  // Handle Prisma Record Not Found
  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'error.not_found';
  }

  // File Upload Errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'File quá lớn. Tối đa 5MB.';
  } else if (err.message && err.message.includes('upload')) {
    statusCode = 400;
    message = err.message;
  }

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = globalErrorHandler;
