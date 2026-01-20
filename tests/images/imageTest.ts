import request from 'supertest';
import app from '../../src/main';
import fs from 'fs';
import path from 'path';
import { PUBLIC_PATH } from '../../src/lib/constants';
import { describe, expect, it } from '@jest/globals';

describe('이미지 업로드 통합 테스트', () => {
    const testImagePath = path.resolve(process.cwd(), 'tests/test.png');
    console.log('실제 테스트 이미지 경로:', testImagePath);
    describe('이미지 업로드', () => {
        let uploadedFileName;
        it('파일을 성공적으로 업로드한다', async () => {
            // 파일이 실제로 존재하는지 먼저 확인
            if (!fs.existsSync(testImagePath)) {
                throw new Error(`테스트용 이미지를 찾을 수 없습니다: ${testImagePath}`);
            }
            const res = await request(app).post('/images/upload').attach('image', testImagePath);
            if (res.statusCode === 500) {
                console.error('서버 에러 상세:', res.body);
            }
            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('url');
            expect(res.body.url).toContain('http://');
            // 생성된 파일명을 추출 (나중에 작업하기 위함)
            uploadedFileName = res.body.url.split('/').pop();
            // 실제 서버 폴더에 파일이 생성되었는지 검증
            const savedPath = path.join(PUBLIC_PATH, uploadedFileName);

            expect(fs.existsSync(savedPath)).toBe(true);
        });
        it('파일 없이 요청하면 400 에러를 반환한다', async () => {
            const res = await request(app).post('/images/upload');

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('이미지 파일이 없습니다.');
        });
    });
});
