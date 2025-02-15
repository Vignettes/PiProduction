import express, { Request, Response } from 'express';
import passport from 'passport';
import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import env from '../config/env';
import logger from '../config/logger';

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Register new user
router.post('/register', async (req: Request, res: Response) => {
  try {
    logger.info('Registration attempt:', { email: req.body.email });
    
    const { email, password, name } = registerSchema.parse(req.body);
    logger.info('Validation passed');

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      logger.info('User already exists:', { email });
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    logger.info('Password hashed');

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email.split('@')[0],
      },
    });
    logger.info('User created successfully:', { userId: user.id });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    logger.info('JWT generated');

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    logger.error('Registration error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input data', details: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login user
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id }, env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    logger.error('Login error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user
router.get(
  '/me',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response) => {
    res.json({ user: req.user });
  }
);

// OAuth routes - only add if credentials are configured
if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  router.get(
    '/google/callback',
    passport.authenticate('google', { session: false }),
    (req: Request, res: Response) => {
      const user = req.user as User;
      const token = jwt.sign({ id: user.id }, env.JWT_SECRET, { expiresIn: '7d' });
      res.redirect(`${env.FRONTEND_URL}/auth/callback?token=${token}`);
    }
  );
}

if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
  router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
  router.get(
    '/github/callback',
    passport.authenticate('github', { session: false }),
    (req: Request, res: Response) => {
      const user = req.user as User;
      const token = jwt.sign({ id: user.id }, env.JWT_SECRET, { expiresIn: '7d' });
      res.redirect(`${env.FRONTEND_URL}/auth/callback?token=${token}`);
    }
  );
}

export default router;
