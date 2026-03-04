import { CursorParamsStruct } from "./commonStructs";
import { object, array, number } from 'superstruct'

export const getMyNotificationParamsStruct = CursorParamsStruct;

export const UpdateNotificationReadStruct = object({
    notificationIds: array(number()),
});