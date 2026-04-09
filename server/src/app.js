import cors from 'cors';
import express from 'express';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { env } from './config/env.js';
import { uploadsRoot } from './config/paths.js';
import { authenticate, requireRole } from './middlewares/authMiddleware.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFound.js';

const app = express();

app.use(
  cors({
    origin: env.clientOrigin
  })
);
app.use(express.json());
app.use('/uploads', express.static(uploadsRoot));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/tasks', authenticate, taskRoutes);
app.use('/admin', authenticate, requireRole('admin'), adminRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
