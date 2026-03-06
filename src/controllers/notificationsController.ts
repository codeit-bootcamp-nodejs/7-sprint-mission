import { Request, Response, NextFunction } from 'express';
import * as notificationService from '../services/notificationService';

export async function markAsRead(req: Request, res: Response, next: NextFunction) {
  try {
    const notification = await notificationService.markAsRead(
      parseInt(req.params.id),
      req.user!.id
    );
    res.json(notification);
  } catch (err) {
    next(err);
  }
}
