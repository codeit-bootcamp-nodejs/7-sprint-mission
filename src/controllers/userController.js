import { create } from 'superstruct';
import bcrypt from 'bcrypt';
import { prismaClient } from '../lib/prismaClient.js';
import BadRequestError from '../lib/errors/BadRequestError.js';
import { UpdateUserBodyStruct, UpdatePasswordBodyStruct } from '../structs/userStructs.js';
import { GetProductListParamsStruct } from '../structs/productsStruct.js';

export async function getUSer(req, res) {
    const  {password, ...userWithoutPassword} = req.user;
    return res.send(userWithoutPassword);
}

export async function updateUser(req, res) {
    const { nickmame, image} = create(req.body, UpdateUserBodyStruct);

    const updatedUser = await prismaClient.user.update({
        where: { id: req.user.id },
        data: { nickmame, image },
    });

    const {password, ...userWithoutPassword} = updatedUser;
    return res.send(userWithoutPassword);
}

export async function updatePassword(req,res) {
    const {oldPassword, newPassword} = create(req.body, UpdatePasswordBodyStruct);

    const isPasswordValid = await bcrypt.compare(oldPassword, req.user.password);
    if (!isPasswordValid) {
        throw new BadRequestError('비밀번호가 일치하지 않습니다.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await prismaClient.user.update({
        where: { id: req.user.id },
        data: { password: hashedPassword },
    });

    return res.send('비밀번호 변경 완료');
}

export async function getMyProducts(req, res) {
    const {page, pageSize} = create(req.query, GetProductListParamsStruct);
    const where = {userId: req.user.id};
    const totalCount = await prismaClient.product.count({where});
    const products = await prismaClient.product.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {id: 'desc'},
        where,
    });
    return res.send({
        list: products,
        totalCount,
    });
}