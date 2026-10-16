import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.resolve(__dirname, '../uploads');
const profilesDir = path.join(uploadDir, 'profiles');
const resumesDir = path.join(uploadDir, 'resumes');
const postsDir = path.join(uploadDir, 'posts');

// Ensure subdirectories exist
[uploadDir, profilesDir, resumesDir, postsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'profile_image') {
      cb(null, profilesDir);
    } else if (file.fieldname === 'resume') {
      cb(null, resumesDir);
    } else {
      cb(null, postsDir);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9-_]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${cleanName}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedImageExts = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
  const allowedDocExts = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (file.fieldname === 'resume') {
    if (allowedDocExts.includes(ext) || allowedImageExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid document format. Only PDF, DOC, DOCX allowed.'));
    }
  } else {
    if (allowedImageExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid image format. Only JPG, PNG, WEBP, SVG allowed.'));
    }
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

export default upload;
