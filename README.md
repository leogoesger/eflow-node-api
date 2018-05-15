# eflow-api

[![Build Status](https://travis-ci.org/leogoesger/eflow-node-api.svg?branch=master)](https://travis-ci.org/leogoesger/eflow-node-api)
[![Coverage Status](https://coveralls.io/repos/github/leogoesger/eflow-node-api/badge.svg?branch=FF-112)](https://coveralls.io/github/leogoesger/eflow-node-api?branch=FF-112)

## Getting Started
1. Install Postgres(create db eflow_production)
2. Install Redis
3. Add `.env` file
4. yarn start / production
5. redis-cli flushall
6. yarn run dev-prepare / prod-prepare
7. `/api/renewClasses`

## Testing

Simply run `yarn test` and all your tests in the `test/` directory will be run.

## CI

It uses [Travis-CI](https://travis-ci.org/) and [Coveralls](https://coveralls.io/).

## Sequelize CLI

```
$ npm install -g sequelize-cli            

$ sequelize model:create --name TodoItem --attributes content:string,complete:boolean #Generate a model
```

## Help

For more information on all the things you can do with Sequelize CLI visit [sequelize cli ](https://github.com/sequelize/cli).

## Deployment

```
/usr/local/stow/node-v8.9.4-linux-x64/lib/node_modules/pm2/bin/pm2 start eflow-api --env production

```

## License

Copyright (c) 2018

Licensed under the [MIT license](LICENSE).
