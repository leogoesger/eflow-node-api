const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const CronJob = require('cron').CronJob;

const uploadResultToDatabase = require('./utils/uploadToDatabase')
  .uploadResultToDatabase;
const uploadFlowDataToDatabase = require('./utils/uploadToDatabase')
  .uploadFlowDataToDatabase;

const app = express();

app.use(logger('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use((req, res, next) => {
  const allowed_header = ['http://localhost:4000'];
  const origin = req.headers.origin;
  if (allowed_header.indexOf(origin) > -1) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, gutsyJwt, Accept'
  );
  next();
});
app.disable('etag');

new CronJob( // eslint-disable-line
  '30 * * * * *',
  () => {
    uploadResultToDatabase();
  },
  null,
  true,
  'America/Los_Angeles'
);

new CronJob( // eslint-disable-line
  '0 * * * * *',
  () => {
    uploadFlowDataToDatabase();
  },
  null,
  true,
  'America/Los_Angeles'
);

require('./routes')(app);

module.exports = app;
