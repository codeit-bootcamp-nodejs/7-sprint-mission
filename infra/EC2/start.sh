#!/bin/bash
cd ~/sprint-mission-
npm install
npx prisma generate
npx prisma migrate deploy
pm2 start npm --name pandamarket-api -- run start
pm2 save
pm2 startup