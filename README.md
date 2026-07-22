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

The API, Func Flow API, and client are all deployed behind Nginx. Their Nginx configuration files are located in the sites-available and sites-enabled directories within the Nginx configuration.

API and Func Flow API are running via PM2. You could check on the status via `node_PM2 list` to get a list of APIs that are running. 

To deploy `node_api`
```bash
# cd into node_api folder
npm run pm2:production
```

To deploy `func flow api`
```bash
# not sure if this is necessary
eflow_venv 
# cd into the func flow folder
func_flow_pm2 start ecosystem.json
```

## License

Copyright (c) 2018

Licensed under the [MIT license](LICENSE).
