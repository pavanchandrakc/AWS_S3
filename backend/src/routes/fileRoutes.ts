import { Router, Request, Response } from 'express';
import multer from 'multer';
import pool from '../config/database';
import { authMiddleware } from '../middlewares/auth';
import {
  uploadToS3,
  downloadFromS3,
  deleteFromS3,
  listS3Files,
} from '../services/s3Service';
import { sendMessageToQueue } from '../services/sqsService';
import dotenv from 'dotenv';

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
    }
  }
}

const router: Router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Upload file to S3
router.post(
  '/upload',
  authMiddleware,
  upload.single('file'),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      const userId = req.userId;
      const bucket = process.env.AWS_S3_BUCKET || '';
      const key = `${userId}/${Date.now()}-${req.file.originalname}`;

      // Upload to S3
      await uploadToS3(bucket, key, req.file.buffer, req.file.mimetype);

      // Save file metadata to database
      const result = await pool.query(
        'INSERT INTO files (user_id, file_name, s3_key, file_size, file_type) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [userId, req.file.originalname, key, req.file.size, req.file.mimetype]
      );

      const fileData = result.rows[0];

      // Send message to SQS for background processing
      await sendMessageToQueue({
        action: 'PROCESS_FILE',
        fileId: fileData.id,
        userId: fileData.user_id,
        s3Key: fileData.s3_key,
        fileName: fileData.file_name,
        timestamp: new Date().toISOString()
      });

      res.status(201).json({
        message: 'File uploaded successfully and queued for processing',
        file: fileData,
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Upload failed' });
    }
  }
);

// Get user's files
router.get('/files', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const result = await pool.query(
      'SELECT * FROM files WHERE user_id = $1 ORDER BY uploaded_at DESC',
      [userId]
    );

    res.json({ files: result.rows });
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ error: 'Failed to get files' });
  }
});

// Download file from S3
router.get(
  '/download/:fileId',
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { fileId } = req.params;
      const userId = req.userId;

      // Get file from database
      const result = await pool.query(
        'SELECT * FROM files WHERE id = $1 AND user_id = $2',
        [fileId, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'File not found' });
      }

      const file = result.rows[0];
      const bucket = process.env.AWS_S3_BUCKET || '';

      // Download from S3
      const fileBuffer = await downloadFromS3(bucket, file.s3_key);

      res.setHeader('Content-Type', file.file_type);
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${file.file_name}"`
      );
      res.send(fileBuffer);
    } catch (error) {
      console.error('Download error:', error);
      res.status(500).json({ error: 'Download failed' });
    }
  }
);

// Delete file
router.delete(
  '/files/:fileId',
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { fileId } = req.params;
      const userId = req.userId;

      // Get file from database
      const result = await pool.query(
        'SELECT * FROM files WHERE id = $1 AND user_id = $2',
        [fileId, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'File not found' });
      }

      const file = result.rows[0];
      const bucket = process.env.AWS_S3_BUCKET || '';

      // Delete from S3
      await deleteFromS3(bucket, file.s3_key);

      // Delete from database
      await pool.query('DELETE FROM files WHERE id = $1', [fileId]);

      res.json({ message: 'File deleted successfully' });
    } catch (error) {
      console.error('Delete error:', error);
      res.status(500).json({ error: 'Delete failed' });
    }
  }
);

// Get S3 file list
router.get('/s3/list', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const bucket = process.env.AWS_S3_BUCKET || '';

    const files = await listS3Files(bucket, `${userId}/`);

    res.json({ files });
  } catch (error) {
    console.error('List files error:', error);
    res.status(500).json({ error: 'Failed to list files' });
  }
});

export default router;
