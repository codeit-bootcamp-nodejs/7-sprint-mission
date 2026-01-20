import app from './main';
import { PORT } from './lib/constants';


app.listen(PORT, () => {
    console.log(`${PORT}번 포트에서 서버 실행 중...`);
});
