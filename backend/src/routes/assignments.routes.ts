import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import {
  createAssignmentHandler,
  listAssignmentsHandler,
  getAssignmentHandler,
  deleteAssignmentHandler,
  regenerateAssignmentHandler,
} from '../controllers/assignments.controller';

const router = Router();

router.post('/', asyncHandler(createAssignmentHandler));
router.get('/', asyncHandler(listAssignmentsHandler));
router.get('/:id', asyncHandler(getAssignmentHandler));
router.delete('/:id', asyncHandler(deleteAssignmentHandler));
router.post('/:id/regenerate', asyncHandler(regenerateAssignmentHandler));

export default router;
