const redis = require('redis');
const client = redis.createClient(process.env.REDIS_PORT);

const annualFlowCache = async (req, res, next) => {
  let cacheKey = `${req.path}_`;
  Object.keys(req.body).forEach(key => {
    cacheKey = cacheKey + key + req.body[key];
  });

  client.get(cacheKey, (err, value) => {
    if (value) {
      // console.log('Cached Value!'); //eslint-disable-line
      // res.status(200).send(JSON.parse(value));
      req.client = client;
      next();
    } else {
      req.client = client;
      next();
    }
  });
};

export default annualFlowCache;
