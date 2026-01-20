import { prisma } from '../src/lib/prisma';
import { afterAll, beforeAll } from '@jest/globals';

process.env.NODE_ENV = 'TEST';
beforeAll(async () => {
    // 테스트용 환경변수 확인 (중요: 운영 DB가 날아가지 않도록)
    if (process.env.NODE_ENV !== 'TEST') {
        throw new Error('TEST 환경이 아닙니다!');
    }
});

afterAll(async () => {
    await prisma.$disconnect();
});
