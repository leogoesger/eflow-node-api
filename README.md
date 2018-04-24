1. Install Postgres(create db eflow_production)
2. Install Redis
3. Add `.env` file
4. yarn start / production
5. redis-cli flushall
6. yarn run dev-prepare / prod-prepare
7. `/api/renewClasses`

Deployment:
`/usr/local/stow/node-v8.9.4-linux-x64/lib/node_modules/pm2/bin/pm2 start eflow-api`
