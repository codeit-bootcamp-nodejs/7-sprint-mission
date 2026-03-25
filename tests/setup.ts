import { prisma } from '../src/lib/prismaClient';
import { server } from '../src/main';

afterAll(async () => {
  await prisma.$disconnect();

  if(server && server.listening) {
    await new Promise((resolve => server.close(resolve)));
  }
});