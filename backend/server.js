import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { testConnection } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import jobsRoutes from './routes/jobsRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import codingRoutes from './routes/codingRoutes.js';
import projectDetailsRoutes from './routes/projectDetailsRoutes.js';
import { createPostRouter } from './routes/postsRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ── CORS Configuration ────────────────────────────────────────────────────────
const allowedOrigins = [
  FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://prephq.theiotacademy.co',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.ngrok-free.app')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev to avoid blocking
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// ── Body Parsing & Static Uploads ─────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Health Check ──────────────────────────────────────────────────────────────
const healthHandler = async (req, res) => {
  const dbOk = await testConnection();
  res.status(dbOk ? 200 : 500).json({
    status: dbOk ? 'healthy' : 'unhealthy',
    database: dbOk ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    uptime_seconds: Math.floor(process.uptime()),
  });
};

app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

// ── Mount API Routes (under both /api and root / for resilience) ──────────────
const mountRoutes = (prefix = '/api') => {
  const router = express.Router();

  router.use('/', authRoutes);
  router.use('/', userRoutes);
  router.use('/', contactRoutes);
  router.use('/jobs', jobsRoutes);
  router.use('/', dashboardRoutes);
  router.use('/', codingRoutes);
  router.use('/project-details', projectDetailsRoutes);

  router.use('/blog', createPostRouter('blog'));
  router.use('/tutorial', createPostRouter('tutorial'));
  router.use('/project', createPostRouter('project'));
  router.use('/interview', createPostRouter('interview'));

  return router;
};

// Mount under /api (standard for Vite frontend)
app.use('/api', mountRoutes('/api'));

// Mount directly under root for backwards compatibility
app.use('/', mountRoutes(''));

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    status: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// ── Central Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ── Server Start ──────────────────────────────────────────────────────────────
const startServer = async () => {
  console.log('--- Starting PrepHQ Express Backend ---');
  const dbConnected = await testConnection();

  if (!dbConnected) {
    console.warn('[Warning] MySQL connection could not be established immediately. Check DB credentials in backend/.env.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] PrepHQ Backend API running on http://localhost:${PORT}`);
    console.log(`[Server] Health check: http://localhost:${PORT}/api/health`);
    console.log(`[Server] Configured Frontend URL: ${FRONTEND_URL}`);
  });
};

startServer();

export default app;
