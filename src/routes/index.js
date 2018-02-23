const gaugesController = require('../controllers').gauges;

module.exports = app => {
  app.get('/api', gaugesController.show);
  app.get('/api/gauge', gaugesController.create);
};
