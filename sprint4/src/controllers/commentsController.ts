import { Request, Response } from 'express';
import { CommentRepository } from '../repositories/commentRepository.js';
import { prismaClient } from '../lib/prismaClient.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import UnauthorizedError from '../lib/errors/UnauthorizedError.js';
import ForbiddenError from '../lib/errors/ForbiddenError.js';
import { idParamsSchema } from '../schemas/commonSchemas.js';
import { updateCommentSchema } from '../schemas/commentSchemas.js';

// Initialize repository
const commentRepository = new CommentRepository(prismaClient);

export async function updateComment(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id } = idParamsSchema.parse(req.params);
  const data = updateCommentSchema.parse(req.body);

  const existingComment = await commentRepository.findById(id);
  
  if (!existingComment) {
    throw new NotFoundError('comment', id);
  }

  if (existingComment.userId !== req.user.id) {
    throw new ForbiddenError('Should be the owner of the comment');
  }

  const updatedComment = await commentRepository.update(id, data);

  return res.send(updatedComment);
}

export async function deleteComment(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id } = idParamsSchema.parse(req.params);

  const existingComment = await commentRepository.findById(id);
  
  if (!existingComment) {
    throw new NotFoundError('comment', id);
  }

  if (existingComment.userId !== req.user.id) {
    throw new ForbiddenError('Should be the owner of the comment');
  }

  await commentRepository.delete(id);
  
  return res.status(204).send();
}
