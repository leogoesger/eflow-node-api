const gaugesController = require('../controllers').gauges;

module.exports = app => {
  app.get('/api', gaugesController.show);
};
