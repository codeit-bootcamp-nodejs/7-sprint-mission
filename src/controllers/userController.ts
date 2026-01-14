import { Request, Response } from 'express';
import { create } from 'superstruct';
import { UpdateUserBodyStruct, UpdatePasswordBodyStruct } from '../structs/userStruct';
import { GetProductListParamsStruct } from '../structs/productsStruct';
import { userService } from '../services/userService';
import { AuthenticatedRequest } from '../types/express';
export async function getUser(req: Request, res: Response) {
    const {user} = req as AuthenticatedRequest;
    const  {password, ...userWithoutPassword} = user;
    return res.send(userWithoutPassword);
}

export async function updateUser(req: Request, res: Response) {
    const {user, body} = req as AuthenticatedRequest;
    const data = create(body, UpdateUserBodyStruct);
    const updatedUser = await userService.updateUser(user.id, data);
    return res.send(updatedUser);
}

export async function updatePassword(req: Request,res: Response) {
    const {user, body} = req as AuthenticatedRequest;
    const data = create(body, UpdatePasswordBodyStruct);
    await userService.updatePassword(user.id, data, user.password);
    return res.send({message: '비밀번호 변경 완료'});
}

export async function getMyProducts(req: Request, res: Response) {
    const {user, query} = req as AuthenticatedRequest;
    const {page, pageSize} = create(query, GetProductListParamsStruct);
    const result = await userService.getMyProducts(user.id, page, pageSize);
    return res.send(result);
}

export async function getLikedProducts(req: Request, res: Response) {
    const {user, query} = req as AuthenticatedRequest;
    const {page, pageSize} = create(query, GetProductListParamsStruct);
    const result = await userService.getLikedProducts(user.id, page, pageSize);
    return res.send(result);
}