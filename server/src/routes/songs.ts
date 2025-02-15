import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { authenticateToken } from '../middleware/auth';
import logger from '../config/logger';
import { analyzeSong } from '../services/audioAnalysis';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

interface SongFile {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  uploadDate: Date;
  mimeType: string;
  url: string;
  analysis?: any;
}

// List all songs
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const uploadsDir = path.join(__dirname, '../../uploads');
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      return res.json({ songs: [] });
    }

    const files = fs.readdirSync(uploadsDir);
    const songs: SongFile[] = files
      .filter(file => file.match(/\.(mp3|wav)$/i))
      .map(filename => {
        const filePath = path.join(uploadsDir, filename);
        const stats = fs.statSync(filePath);
        
        // Extract original name from the filename (remove timestamp and random number)
        const originalName = filename.split('-').slice(2).join('-');
        
        return {
          id: filename.split('-')[0] + '-' + filename.split('-')[1],
          filename,
          originalName,
          size: stats.size,
          uploadDate: stats.mtime,
          mimeType: filename.endsWith('.mp3') ? 'audio/mpeg' : 'audio/wav',
          url: `/uploads/${filename}`
        };
      })
      .sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime()); // Sort by newest first

    // Get analysis for each song
    const songsWithAnalysis = await Promise.all(
      songs.map(async (song) => {
        try {
          // Check if analysis exists in database
          const analysis = await prisma.songAnalysis.findUnique({
            where: { songId: song.id }
          });

          if (analysis) {
            return { ...song, analysis: analysis.data };
          }

          // If no analysis exists, perform analysis
          const filePath = path.join(uploadsDir, song.filename);
          const newAnalysis = await analyzeSong(filePath);

          // Save analysis to database
          await prisma.songAnalysis.create({
            data: {
              songId: song.id,
              data: newAnalysis
            }
          });

          return { ...song, analysis: newAnalysis };
        } catch (error) {
          logger.error(`Error analyzing song ${song.filename}:`, error);
          return song; // Return song without analysis if it fails
        }
      })
    );

    logger.info(`Retrieved ${songsWithAnalysis.length} songs with analysis`);
    res.json({ songs: songsWithAnalysis });
  } catch (error: any) {
    logger.error('Error listing songs:', error);
    res.status(500).json({ error: error.message || 'Error listing songs' });
  }
});

// Get a single song by ID
router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const uploadsDir = path.join(__dirname, '../../uploads');
    
    const files = fs.readdirSync(uploadsDir);
    const song = files.find(file => file.startsWith(id));
    
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }

    const filePath = path.join(uploadsDir, song);
    const stats = fs.statSync(filePath);
    const originalName = song.split('-').slice(2).join('-');

    // Get or create analysis
    const analysis = await prisma.songAnalysis.findUnique({
      where: { songId: id }
    });

    const songData: SongFile = {
      id,
      filename: song,
      originalName,
      size: stats.size,
      uploadDate: stats.mtime,
      mimeType: song.endsWith('.mp3') ? 'audio/mpeg' : 'audio/wav',
      url: `/uploads/${song}`,
      analysis: analysis?.data || await analyzeSong(filePath)
    };

    if (!analysis) {
      // Save new analysis
      await prisma.songAnalysis.create({
        data: {
          songId: id,
          data: songData.analysis
        }
      });
    }

    res.json(songData);
  } catch (error: any) {
    logger.error('Error getting song:', error);
    res.status(500).json({ error: error.message || 'Error getting song' });
  }
});

export default router;
