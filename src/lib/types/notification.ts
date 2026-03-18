export enum NotificationType {
    PRICE_CHANGED = 'PRICE_CHANGED',
    NEW_COMMENT = 'NEW_COMMENT',
}

interface BaseNotification {
    id: string;
    userId: string;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface PriceChangedNotification extends BaseNotification {
    type: NotificationType.PRICE_CHANGED;
    payload: {
        productId: string;
        price: number;
    };
}

interface NewCommentNotification extends BaseNotification {
    type: NotificationType.NEW_COMMENT;
    payload: {
        articleId: string;
    };
}

export type Notification = PriceChangedNotification | NewCommentNotification;
