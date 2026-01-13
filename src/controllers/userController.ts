import { Request, Response } from 'express';
import { create } from 'superstruct';
import { UpdateUserBodyStruct, UpdatePasswordBodyStruct } from '../structs/userStruct';
import { GetProductListParamsStruct } from '../structs/productsStruct';
import { userService } from '../services/userService';
export async function getUser(req: Request, res: Response) {
    const  {password, ...userWithoutPassword} = req.user!;
    return res.send(userWithoutPassword);
}

export async function updateUser(req: Request, res: Response) {
    const data = create(req.body, UpdateUserBodyStruct);
    const user = await userService.updateUser(req.user!.id, data);
    return res.send(user);
}

export async function updatePassword(req: Request,res: Response) {
    const data = create(req.body, UpdatePasswordBodyStruct);
    await userService.updatePassword(req.user!.id, req.user!.password, data, req.user!.password);
    return res.send({message: '비밀번호 변경 완료'});
}

export async function getMyProducts(req: Request, res: Response) {
    const {page, pageSize} = create(req.query, GetProductListParamsStruct);
    const result = await userService.getMyProducts(req.user!.id, page, pageSize);
    return res.send(result);
}

export async function getLikedProducts(req: Request, res: Response) {
    const {page, pageSize} = create(req.query, GetProductListParamsStruct);
    const result = await userService.getLikedProducts(req.user!.id, page, pageSize);
    return res.send(result);
}