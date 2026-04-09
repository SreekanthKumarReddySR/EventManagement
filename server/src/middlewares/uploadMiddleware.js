import path from 'path';
import multer from 'multer';
import { ensureUploadDirectories, profileUploadsRoot, toPublicUploadPath } from '../config/paths.js';

ensureUploadDirectories();

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, profileUploadsRoot);
  },
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname || '').toLowerCase();
    const safeExtension = extension || '.jpg';
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${safeExtension}`;
    callback(null, uniqueName);
  }
});

function fileFilter(req, file, callback) {
  if (!allowedMimeTypes.has(file.mimetype)) {
    callback(new Error('Only JPG, PNG, WEBP, and GIF images are allowed.'));
    return;
  }

  callback(null, true);
}

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter
});

export const uploadProfilePhoto = upload.single('photo');

export function getUploadedPhotoPath(file) {
  return file ? toPublicUploadPath(file.filename) : null;
}
