import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

const _filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(_filename);

const swaggerPath = path.resolve(__dirname, '../../src/lib/swagger/**/*.yaml');

const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            version: '1.0.0',
            title: 'Sprint Mission 4',
            description: '스프린트 미션4 API 문서',
        },
        servers: [
            {
                url: 'https://sprint4-gqmg.onrender.com',
                description: '배포 환경',
            },
            {
                url: 'http://localhost:3000',
                description: '개발 환경',
            },
        ],
        tags: [
            { name: 'Users', description: '로그인 및 회원관리' },
            { name: 'Products', description: '상품 CRUD 및 좋아요 기능' },
            { name: 'Articles', description: '게시글 CRUD 및 좋아요 기능' },
            { name: 'Comments', description: '상품/게시글 댓글 관리' },
            { name: 'Images', description: '이미지 업로드 API' },
        ],
    },

    apis: [swaggerPath],
};

export const specs = swaggerJsdoc(options);

export { swaggerUi };
