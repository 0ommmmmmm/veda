import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { resetStaleGenerations } from '../services/generationRecovery.service';

const router = Router();

// Dev utility: reset all queued/processing to failed
router.post(
  '/reset-generation',
  asyncHandler(async (_req, res) => {
    const result = await resetStaleGenerations({ mode: 'all-in-progress' });
    res.json({ ok: true, ...result });
  })
);

export default router;

