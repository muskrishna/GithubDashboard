import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import reposRouter from './routes/repos.js';
import favoritesRouter from './routes/favorites.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const { PORT = 5000, MONGODB_URI, CLIENT_ORIGIN = 'http://localhost:5173' } = process.env;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is missing. Copy .env.example to .env and fill it in.');
  process.exit(1);
}

const app = express();
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json({ limit: '10kb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/repos', reposRouter);
app.use('/api/favorites', favoritesRouter);
app.use(notFound);
app.use(errorHandler);

try {
  await mongoose.connect(MONGODB_URI);
  // Make sure the unique index exists before accepting saves.
  await mongoose.model('Favorite').init();
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
} catch (err) {
  console.error('Could not connect to MongoDB:', err.message);
  process.exit(1);
}
