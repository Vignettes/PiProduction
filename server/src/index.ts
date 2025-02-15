import express from 'express';
import cors from 'cors';
import passport from 'passport';
import { PrismaClient } from '@prisma/client';
import env from './config/env';
import logger from './config/logger';
import './config/passport';
import authRouter from './routes/auth';

// Initialize Express app
const app = express();
const prisma = new PrismaClient();

// Handle preflight requests
app.options('*', cors());

// CORS configuration
const corsOptions = {
  origin: '*', // Temporarily allow all origins for debugging
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(passport.initialize());

// Request logging
app.use((req, res, next) => {
  logger.info('Incoming request:', {
    method: req.method,
    path: req.path,
    origin: req.headers.origin,
    headers: req.headers,
  });
  next();
});

// Routes
app.use('/api/auth', authRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Server error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// Start server
const PORT = env.PORT || 3001;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
