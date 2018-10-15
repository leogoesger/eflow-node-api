const redis = require('redis');
if (process.env.NODE_ENV === 'test') {
  process.env.REDIS_PORT = 6379;
}
const client = redis.createClient(process.env.REDIS_PORT);

const cache = async (req, res, next) => {
  if (typeof req.body.nonDim == 'undefined') {
    req.body.nonDim = true;
  }

  const tableName = req.path.split('/')[2];
  let cacheKey;
  if (req.body.classId) {
    cacheKey = req.body.nonDim
      ? `${req.body.classId}_${tableName}_${req.body
          .metric}_nonDim_boxplot_${req.body.condition}`
      : `${req.body.classId}_${tableName}_${req.body.metric}_dim_boxplot_${req
          .body.condition}`;
  } else if (tableName.includes('getAllClassesBoxPlotAttributes')) {
    cacheKey = 'NON_DIM_ALL_BOXPLOTS';
  } else {
    cacheKey = req.body.nonDim
      ? `${req.body.gaugeId}_${tableName}_${req.body
          .metric}_nonDim_boxplot_${req.body.condition}`
      : `${req.body.gaugeId}_${tableName}_${req.body.metric}_dim_boxplot_${req
          .body.condition}`;
  }
  if (process.env.NODE_ENV === 'test') {
    req.client = client;
    req.tableName = tableName;
    return next();
  }
  client.get(cacheKey, (err, value) => {
    if (value) {
      console.log('Cached Value!'); //eslint-disable-line
      res.status(200).send(JSON.parse(value));
    } else {
      req.client = client;
      req.tableName = tableName;
      next();
    }
  });
};

export default cache;
