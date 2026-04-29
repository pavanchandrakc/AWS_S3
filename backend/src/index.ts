import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database';
import authRoutes from './routes/authRoutes';
import fileRoutes from './routes/fileRoutes';
import { startWorker } from './workers/worker';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API History/Logging Middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  const timestamp = new Date().toLocaleString();

  // Capture the original send function
  const originalSend = res.send;

  res.send = function (data: any) {
    const duration = Date.now() - startTime;
    console.log(`[${timestamp}] ${req.method} ${req.path} - Status: ${res.statusCode} - ${duration}ms`);

    // Call the original send
    return originalSend.call(this, data);
  };

  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Initialize and start server
const startServer = async () => {
  try {
    // Initialize database
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      // Start SQS worker in the background
      startWorker();
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
