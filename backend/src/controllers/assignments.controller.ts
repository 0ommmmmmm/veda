import { Request, Response } from 'express';
import { createAssignmentSchema } from '../validators/assignment.schema';
import {
  createAssignment,
  listAssignments,
  getAssignmentById,
  deleteAssignmentById,
  prepareRegeneration,
} from '../services/assignment.service';
import { removeGenerationJob } from '../queues/generation.queue';
import { enqueueGeneration } from '../services/generationEnqueue.service';
import { serializeAssignment } from '../utils/serializeAssignment';
import { AppError } from '../middleware/errorHandler';

export async function createAssignmentHandler(
  req: Request,
  res: Response
): Promise<void> {
  const input = createAssignmentSchema.parse(req.body);
  const assignment = await createAssignment(input);

  const assignmentId = assignment._id.toString();

  await enqueueGeneration(assignmentId);

  const latest = await getAssignmentById(assignmentId);
  res.status(201).json(serializeAssignment(latest ?? assignment));
}

export async function listAssignmentsHandler(
  _req: Request,
  res: Response
): Promise<void> {
  const assignments = await listAssignments();
  const serialized = assignments.map((doc) =>
    serializeAssignment(doc, {
      includeQuestionPaper: doc.generationStatus === 'completed',
    })
  );
  res.json(serialized);
}

export async function getAssignmentHandler(
  req: Request,
  res: Response
): Promise<void> {
  const assignment = await getAssignmentById(req.params.id as string);
  if (!assignment) {
    throw new AppError(404, 'Assignment not found');
  }
  res.json(serializeAssignment(assignment));
}

export async function deleteAssignmentHandler(
  req: Request,
  res: Response
): Promise<void> {
  const id = req.params.id as string;
  const deleted = await deleteAssignmentById(id);
  if (!deleted) {
    throw new AppError(404, 'Assignment not found');
  }

  await removeGenerationJob(id).catch(() => undefined);

  res.status(204).send();
}

export async function regenerateAssignmentHandler(
  req: Request,
  res: Response
): Promise<void> {
  const id = req.params.id as string;

  // Hard guard: if already queued/processing, do NOT enqueue again
  const existing = await getAssignmentById(id);
  if (!existing) {
    throw new AppError(404, 'Assignment not found');
  }
  if (existing.generationStatus === 'queued' || existing.generationStatus === 'processing') {
    const updatedAt = existing.updatedAt ?? new Date(0);
    const isStale = Date.now() - updatedAt.getTime() > 2 * 60 * 1000;
    if (!isStale) {
      res.json(serializeAssignment(existing));
      return;
    }
    // stale queued/processing -> allow regeneration
  }

  const assignment = await prepareRegeneration(id);
  if (!assignment) {
    throw new AppError(404, 'Assignment not found');
  }

  await removeGenerationJob(id).catch(() => undefined);
  await enqueueGeneration(id);

  const latest = await getAssignmentById(id);
  res.json(serializeAssignment(latest ?? assignment));
}
