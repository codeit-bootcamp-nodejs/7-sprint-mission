import { prisma } from '../lib/prisma';
import { Notification } from '../lib/types/notification';
import { CursorPaginationParams } from '../lib/types/pagination';

export async function getNotificationsByUserId(userId: string, params: CursorPaginationParams) {
    const { cursor, limit } = params;
    const where = {
        userId: BigInt(userId),
    };
    const notificationsWithCursor = await prisma.notification.findMany({
        cursor: cursor ? { id: cursor } : undefined,
        take: limit + 1,
        where,
        orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
    });
    const totalCount = await prisma.notification.count({ where });
    const unreadCount = await prisma.notification.count({ where: { ...where, read: false } });
    const notifications = notificationsWithCursor.slice(0, limit);
    const cursorNotification = notificationsWithCursor[notificationsWithCursor.length - 1];
    const nextCursor = cursorNotification ? cursorNotification.id : null;
    return { notifications, totalCount, unreadCount, nextCursor };
}

export async function createNotification(
    data: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>,
) {
    return prisma.notification.create({
        data: {
            type: data.type,
            read: data.read,
            payload: data.payload,
            userId: BigInt(data.userId),
        },
        select: {
            id: true,
            userId: true,
            payload: true,
            createdAt: true,
        },
    });
}

export async function createNotifications(
    data: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>[],
) {
    const formattedData = data.map(({ userId, payload, ...rest }) => ({
        ...rest,
        userId: BigInt(userId), // string을 BigInt로 변환
        payload: payload as any, // 유니온 타입 객체를 Json 타입으로 인정
    }));
    await prisma.notification.createMany({
        data: formattedData,
    });
}

export async function getNotificationById(id: string) {
    return prisma.notification.findUnique({
        where: { id: BigInt(id) },
    });
}

export async function updateNotificationById(id: string, data: Partial<Notification>) {
    const { id: _, userId: __, payload, ...actualData } = data;
    await prisma.notification.update({
        where: { id: BigInt(id) },
        data: {
            ...actualData,
            ...(payload && { payload: payload as any }),
        },
    });
}

export async function updateNotificationsByUserId(userId: string, data: Partial<Notification>) {
    const { id: _, userId: __, payload, ...actualData } = data;
    await prisma.notification.updateMany({
        where: { userId: BigInt(userId) },
        data: {
            ...actualData,
            ...(payload && { payload: payload as any }),
        },
    });
}
