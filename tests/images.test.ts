import request from 'supertest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import app from '../src/main.js';
import { PUBLIC_PATH } from '../src/lib/constants.js';

// ESM 환경에서 경로 설정을 위한 코드
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('이미지 업로드 통합 테스트', () => {
  const validImagePath = path.join(__dirname, 'test-image.png');
  const invalidFilePath = path.join(__dirname, 'test-file.txt');
  let uploadedUrl: string = '';

  beforeAll(() => {
    // 1. 테스트용 진짜 이미지 파일 생성 (PNG 형식 더미)
    fs.writeFileSync(validImagePath, Buffer.from('fake-png-binary-data'));
    // 2. 허용되지 않는 형식의 파일 생성 (TXT)
    fs.writeFileSync(invalidFilePath, 'this is a text file');

    // 업로드 폴더가 없으면 생성
    if (!fs.existsSync(PUBLIC_PATH)) {
      fs.mkdirSync(PUBLIC_PATH, { recursive: true });
    }
  });

  afterAll(() => {
    // 테스트에 사용한 로컬 임시 파일 삭제
    if (fs.existsSync(validImagePath)) fs.unlinkSync(validImagePath);
    if (fs.existsSync(invalidFilePath)) fs.unlinkSync(invalidFilePath);

    // 서버에 업로드되어 저장된 실제 파일 삭제 (테스트 환경 정리)
    if (uploadedUrl) {
      const fileName = uploadedUrl.split('/').pop();
      if (fileName) {
        const savedPath = path.join(PUBLIC_PATH, fileName);
        if (fs.existsSync(savedPath)) fs.unlinkSync(savedPath);
      }
    }
  });

  describe('POST /images/upload', () => {
    it('허용된 형식(PNG)의 이미지를 업로드하면 201과 URL을 반환한다', async () => {
      const res = await request(app)
        .post('/images/upload')
        // 라우터의 upload.single('image') 필드명과 일치해야 합니다.
        .attach('image', validImagePath);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('url');
      expect(res.body.url).toContain('http://');

      uploadedUrl = res.body.url;

      // 실제 서버의 PUBLIC_PATH에 파일이 물리적으로 존재하는지 검증
      const fileName = uploadedUrl.split('/').pop() || '';
      const isFileExist = fs.existsSync(path.join(PUBLIC_PATH, fileName));
      expect(isFileExist).toBe(true);
    });

    it('허용되지 않는 형식(TXT)의 파일을 업로드하면 400 에러를 반환한다 (MIME 타입 검증)', async () => {
      const res = await request(app).post('/images/upload').attach('image', invalidFilePath);

      // globalErrorHandler가 BadRequestError를 400으로 처리함
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Only png, jpeg, and jpg are allowed');
    });

    it('파일 없이 요청을 보내면 400 에러를 반환한다', async () => {
      const res = await request(app).post('/images/upload');

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('파일이 업로드되지 않았습니다.');
    });
  });
});
