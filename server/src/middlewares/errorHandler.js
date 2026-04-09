import multer from 'multer';

export function errorHandler(error, req, res, next) {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'Image must be 5MB or smaller.' });
    }

    return res.status(400).json({ message: error.message || 'File upload failed.' });
  }

  if (error.message === 'Only JPG, PNG, WEBP, and GIF images are allowed.') {
    return res.status(400).json({ message: error.message });
  }

  return res.status(500).json({
    message: 'Something went wrong on the server.',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
}
