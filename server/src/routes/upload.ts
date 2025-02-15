import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import logger from '../config/logger';
import { authenticateToken, JwtPayload } from '../middleware/auth';

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

// File filter to accept only audio files
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only MP3 and WAV files are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Upload endpoint
const handleUpload = async (req: Request, res: Response) => {
  try {
    const file = (req as any).file;
    const user = (req as any).user;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    logger.info('File uploaded successfully', {
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype,
      userId: user.userId
    });

    return res.json({
      message: 'File uploaded successfully',
      file: {
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype
      }
    });
  } catch (error: any) {
    logger.error('Error uploading file:', error);
    return res.status(500).json({ error: error.message || 'Error uploading file' });
  }
};

router.post('/', authenticateToken, upload.single('audio'), handleUpload);

export default router;
