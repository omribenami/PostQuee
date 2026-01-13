#!/bin/bash
pm2 delete all 2>/dev/null

cd /app/apps/frontend
pm2 start "npm start -- -p 4200" --name frontend

cd /app/apps/backend
pm2 start "node --experimental-require-module ./dist/apps/backend/src/main.js" --name backend

cd /app/apps/workers
pm2 start "node --experimental-require-module ./dist/apps/workers/src/main.js" --name workers

cd /app/apps/cron
pm2 start "node --experimental-require-module ./dist/apps/cron/src/main.js" --name cron

pm2 save
