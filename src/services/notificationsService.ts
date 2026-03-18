import { UnauthorizedError } from '../lib/errors/UnauthorizedError';
import { NotFoundError } from '../lib/errors/NotFoundError';
import { ForbiddenError } from '../lib/errors/ForbiddenError';
import { CursorPaginationParams } from '../lib/types/pagination';
import { Notification } from '../lib/types/notification';
import * as notificationsRepository from '../repositories/notificationsRepository';
import * as usersRepository from '../repositories/authRepository';
import socketService from './socketService';

export async function createNotification(
    data: Omit<Notification, 'id' | 'read' | 'createdAt' | 'updatedAt'>,
) {
    const existingUser = await usersRepository.findUserByUserId(String(data.userId));
    if (!existingUser) {
        throw new NotFoundError('User', Number(data.userId));
    }

    const notification = await notificationsRepository.createNotification({
        ...data,
        read: false,
    });

    socketService.sendNotification(notification as unknown as Notification);

    return notification;
}

export async function createNotifications(
    notifications: Omit<Notification, 'id' | 'read' | 'createdAt' | 'updatedAt'>[],
) {
    await notificationsRepository.createNotifications(
        notifications.map((notification) => ({
            ...notification,
            read: false,
        })),
    );

    notifications.forEach((notification) => {
        socketService.sendNotification(notification as Notification);
    });
}

export async function readNotificationById(id: string, userId?: string) {
    if (!userId) {
        throw new UnauthorizedError('Unauthorized');
    }

    const notification = await notificationsRepository.getNotificationById(id);
    if (!notification) {
        throw new NotFoundError('Notification', Number(id));
    }

    if (notification.userId.toString() !== userId) {
        throw new ForbiddenError("Cannot read other user's notification");
    }

    await notificationsRepository.updateNotificationById(id, { read: true });
}

export async function getMyNotifications(userId: string, params: CursorPaginationParams) {
    if (!userId) {
        throw new UnauthorizedError('Unauthorized');
    }

    const { cursor, limit } = params;
    const { notifications, totalCount, unreadCount, nextCursor } =
        await notificationsRepository.getNotificationsByUserId(userId, { cursor, limit });
    return { list: notifications, totalCount, unreadCount, nextCursor };
}
