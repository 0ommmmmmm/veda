import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import assignmentsRouter from './routes/assignments.routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/assignments', assignmentsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
