import express from 'express';
import cors from 'cors';
import path from 'path';
import { PUBLIC_PATH, STATIC_PATH } from './lib/constants';
import articleRouter from './routers/articleRouter';
import productRouter from './routers/productRouter';
import imageRouter from './routers/imageRouter';
import authsRouter from './routers/authRouter';
import { defaultNotFoundHandler, globalErrorHandler } from './controllers/errorController';
import cookieParser from 'cookie-parser';
import passport from './lib/passport/index';
import { specs, swaggerUi } from './lib/swagger.util';
import homeRouter from './routers/homeRouter';

const app = express();
app.use(cors());
app.use(express.json());
(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};
app.use(cookieParser());
app.use(passport.initialize());
app.use(STATIC_PATH, express.static(path.resolve(process.cwd(), PUBLIC_PATH)));

app.use('/articles', articleRouter);
app.use('/products', productRouter);
app.use('/images', imageRouter);
app.use('/auth', authsRouter);
if (process.env.NODE_ENV !== 'TEST') {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
}
app.use('/', homeRouter);

app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);

export default app;
