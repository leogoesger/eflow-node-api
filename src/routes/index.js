const allYearsController = require('../controllers').allYears;
const classesController = require('../controllers').classifications;
const fallsController = require('../controllers').falls;
const fallWintersController = require('../controllers').fallWinters;
const gaugesController = require('../controllers').gauges;
const springsController = require('../controllers').springs;
const summersController = require('../controllers').summers;
const wintersController = require('../controllers').winters;
const yearsController = require('../controllers').years;
const hydrographsController = require('../controllers').hydrographs;
const papersController = require('../controllers').papers;
const membersController = require('../controllers').members;

module.exports = app => {
  app.post('/api/years', yearsController.show);
  app.get('/api/hydrographs/:featureId', hydrographsController.show);

  app.get('/api/papers', papersController.index);
  app.get('/api/members', membersController.index);

  app.get('/api/classes', classesController.index);
  app.post('/api/classes', classesController.update);
  app.get('/api/classes/:classId', classesController.show);

  app.post('/api/gauges', gaugesController.create);
  app.get('/api/gauges', gaugesController.index);
  app.get('/api/gauges/:gaugeId', gaugesController.show);

  app.post('/api/allyears', allYearsController.show);
  app.post(
    '/api/allyears/getBoxPlotAttributes',
    allYearsController.getBoxPlotAttributes
  );

  app.post('/api/springs', springsController.show);
  app.post(
    '/api/springs/getBoxPlotAttributes',
    springsController.getBoxPlotAttributes
  );

  app.post('/api/falls', fallsController.show);
  app.post(
    '/api/falls/getBoxPlotAttributes',
    fallsController.getBoxPlotAttributes
  );

  app.post('/api/fallwinters', fallWintersController.show);
  app.post(
    '/api/fallwinters/getBoxPlotAttributes',
    fallWintersController.getBoxPlotAttributes
  );

  app.post('/api/summers', summersController.show);
  app.post(
    '/api/summers/getBoxPlotAttributes',
    summersController.getBoxPlotAttributes
  );

  app.post('/api/winters', wintersController.show);
  app.post(
    '/api/winters/getBoxPlotAttributes',
    wintersController.getBoxPlotAttributes
  );
};
