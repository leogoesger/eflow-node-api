import {cache} from '../middlewares';
import {annualFlowCache} from '../middlewares';
const authenticate = require('../middlewares/authentication').authenticate;

const adminUpdates = require('../controllers').adminUpdates;
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
const annualFlowsController = require('../controllers').annualFlows;
const usersController = require('../controllers').users;
const releasesController = require('../controllers').releases;
const geoSitesController = require('../controllers').geoSites;
const geoRegionsController = require('../controllers').geoRegions;

module.exports = app => {
  app.post('/api/years', yearsController.show);
  app.get('/api/hydrographs/:featureId', hydrographsController.show);
  app.post('/api/dimHydrographs', hydrographsController.getDimHydrograph);

  app.get('/api/papers', papersController.index);
  app.get('/api/members', membersController.index);

  app.get('/api/classes', classesController.index);
  app.get('/api/classes/:classId', classesController.show);

  app.get('/api/gauges', gaugesController.index);
  app.get('/api/gauges/:gaugeId', gaugesController.show);
  app.post('/api/gauges/search', gaugesController.search);

  app.post('/api/allyears', allYearsController.show);
  app.post(
    '/api/allyears/getBoxPlotAttributes',
    cache,
    allYearsController.getBoxPlotAttributes
  );

  app.post('/api/springs', springsController.show);
  app.post(
    '/api/springs/getBoxPlotAttributes',
    cache,
    springsController.getBoxPlotAttributes
  );

  app.post('/api/falls', fallsController.show);
  app.post(
    '/api/falls/getBoxPlotAttributes',
    cache,
    fallsController.getBoxPlotAttributes
  );

  app.post('/api/fallwinters', fallWintersController.show);
  app.post(
    '/api/fallwinters/getBoxPlotAttributes',
    cache,
    fallWintersController.getBoxPlotAttributes
  );

  app.post('/api/summers', summersController.show);
  app.post(
    '/api/summers/getBoxPlotAttributes',
    cache,
    summersController.getBoxPlotAttributes
  );

  app.post('/api/winters', wintersController.show);
  app.post(
    '/api/winters/getBoxPlotAttributes',
    cache,
    wintersController.getBoxPlotAttributes
  );

  app.post('/api/annualFlows', annualFlowCache, annualFlowsController.show);
  app.post('/api/annualFlowPOR', annualFlowsController.getPercentilePOR);

  app.post('/api/bugReport', (req, res) => {
    usersController.emailReport(req, res);
  });

  app.get('/api/releases', releasesController.getReleases);
  app.post('/api/releases', releasesController.createRelease);

  app.get('/api/geoSites', geoSitesController.index);
  app.get('/api/geoRegions', geoRegionsController.index);

  app.post(
    '/api/admin/update-class-metrics',
    authenticate,
    adminUpdates.updateClassMetricData
  );
  app.post(
    '/api/admin/update-gauge-metrics/:id',
    authenticate,
    adminUpdates.updateGaugeMetricData
  );
  app.post('/api/admin/broadcast-message', authenticate, (req, res) =>
    adminUpdates.broadcastDownServerMsg(req, res, app.io)
  );
  app.post(
    '/api/admin/upload-flow-date',
    authenticate,
    adminUpdates.uploadFlowData
  );
  app.post(
    '/api/admin/upload-metric-result',
    authenticate,
    adminUpdates.uploadMetricResult
  );
  app.post(
    '/api/admin/upload-class-hydrograph',
    authenticate,
    adminUpdates.uploadClassHydrograph
  );
  app.post(
    '/api/admin/upload-gauge-hydrograph',
    authenticate,
    adminUpdates.uploadGaugeHydrograph
  );

  app.post('/api/user/signup', usersController.signUp);
  app.post('/api/user/login', usersController.login);
};
