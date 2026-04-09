import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const serverRoot = path.resolve(__dirname, '..', '..');
export const workspaceRoot = path.resolve(serverRoot, '..');
export const uploadsRoot = path.join(serverRoot, 'uploads');
export const profileUploadsRoot = path.join(uploadsRoot, 'profiles');

export function ensureUploadDirectories() {
  fs.mkdirSync(profileUploadsRoot, { recursive: true });
}

export function toPublicUploadPath(fileName) {
  return `/uploads/profiles/${fileName}`;
}

export function toAbsoluteUploadPath(publicPath = '') {
  const normalizedPath = publicPath.replace(/^\/uploads\//, '');
  return path.join(uploadsRoot, normalizedPath);
}
