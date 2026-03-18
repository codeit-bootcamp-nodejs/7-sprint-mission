import { Request, Response } from 'express';
import { create } from 'superstruct';
import { IdParamsStruct } from '../structs/commonStructs';
import * as notificationsService from '../services/notificationsService';
import { BadRequestError } from '../lib/errors/BadRequestError';

export async function readNotification(req: Request, res: Response) {
    const { id } = create(req.params, IdParamsStruct);
    if (!req.user) {
        throw new BadRequestError('User does not exist');
    }
    await notificationsService.readNotificationById(req.user.id, id);
    res.status(200).send();
}
