import { Express } from 'express';
import authRoutes from './auth';

export function registerRoutes(app: Express) {
  // Register auth routes
  app.use('/api/auth', authRoutes);

  return app;
} 