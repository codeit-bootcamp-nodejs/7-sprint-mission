import express, { Request, Response } from 'express';
import { withAsync } from '../lib/withAsync';

const homeRouter = express.Router();

homeRouter.get(
    '/',
    withAsync((req:Request, res:Response) => {
        res.redirect('/docs');
    }),
);

export default homeRouter;
