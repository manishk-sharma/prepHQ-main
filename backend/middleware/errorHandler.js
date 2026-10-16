export const errorHandler = (err, req, res, next) => {
  console.error('[API Error]:', {
    method: req.method,
    path: req.originalUrl,
    message: err.message,
    status: err.status || 500,
  });

  const statusCode = err.status || 500;
  const safeMessage =
    statusCode === 500
      ? 'An unexpected error occurred. Please try again later.'
      : err.message || 'Operation failed.';

  res.status(statusCode).json({
    status: false,
    message: safeMessage,
    error: err.error || safeMessage,
  });
};

export default errorHandler;
