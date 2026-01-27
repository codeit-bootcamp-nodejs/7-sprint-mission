import express from 'express';
import { withAsync } from '../lib/withAsync';
import {
    createArticle,
    deleteArticle,
    getArticle,
    getArticleList,
    getMyLikedArticles,
    toggleArticleLike,
    updateArticle,
} from '../controllers/articleController';
import passport from '../lib/passport/index';
import {
    createComment,
    deleteComment,
    getCommentList,
    updateComment,
} from '../controllers/commentController';

const articleRouter = express.Router();

articleRouter.get(
    '/like/list',
    passport.authenticate('access-token', { session: false, failWithError: true }),
    withAsync(getMyLikedArticles),
);

articleRouter.get('/', withAsync(getArticleList));

articleRouter.patch(
    '/:targetId/comments/:id',
    passport.authenticate('access-token', { session: false, failWithError: true }),
    withAsync(updateComment),
);
articleRouter.delete(
    '/:targetId/comments/:id',
    passport.authenticate('access-token', { session: false, failWithError: true }),
    withAsync(deleteComment),
);

articleRouter.post(
    '/:id/comments',
    passport.authenticate('access-token', { session: false, failWithError: true }),
    withAsync(createComment),
);
articleRouter.get('/:id/comments', withAsync(getCommentList));

articleRouter.get('/:id', withAsync(getArticle));
articleRouter.patch(
    '/:id',
    passport.authenticate('access-token', { session: false, failWithError: true }),
    withAsync(updateArticle),
);
articleRouter.delete(
    '/:id',
    passport.authenticate('access-token', { session: false, failWithError: true }),
    withAsync(deleteArticle),
);

articleRouter.post(
    '/:id/like',
    passport.authenticate('access-token', { session: false, failWithError: true }),
    withAsync(toggleArticleLike),
);

articleRouter.post(
    '/',
    passport.authenticate('access-token', { session: false, failWithError: true }),
    withAsync(createArticle),
);

export default articleRouter;
