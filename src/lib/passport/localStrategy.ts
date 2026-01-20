import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { prisma } from '../prisma';
import { LoginBodyStruct } from '../../structs/authStructs';
import { create } from 'superstruct';
import { User } from '../../classes/User';

const localStrategy = new LocalStrategy(
    {
        usernameField: 'email',
    },
    async function (email: string, password: string, done: any) {
        const data = create({ email, password }, LoginBodyStruct);

        const user = await prisma.user.findUnique({
            where: {
                email: data.email,
            },
        });
        if (!user) {
            return done(null, false, { message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
        }
        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) {
            return done(null, false, { message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
        }
        return done(null, User.fromEntity(user));
    },
);
export default localStrategy;
