import {cache} from '../middlewares';
import {annualFlowCache} from '../middlewares';
const authenticate = require('../middlewares/authentication').authenticate;
const authenticateAdmin = require('../middlewares/authentication')
  .authenticateAdmin;

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
const allSeasonsController = require('../controllers').allSeasons;

const flaskAPIs = require('../APIs').flaskAPIs;
const gitHubAPIs = require('../APIs').gitHubAPIs;

module.exports = app => {
  app.post('/api/years', yearsController.show);
  app.get('/api/hydrographs/:featureId', hydrographsController.show);
  app.post('/api/dimHydrographs', hydrographsController.getDimHydrograph);

  app.get('/api/papers', papersController.index);
  app.get('/api/members', membersController.index);

  app.get('/api/classes', classesController.index);
  app.get('/api/classes/:classId', classesController.show);

  //get git commit history
  app.get('/api/admin/env', /*authenticateAdmin,*/ gitHubAPIs.gitHubCommits);

  app.get('/api/gauges', gaugesController.index);
  app.get('/api/gauges/:gaugeId', gaugesController.show);

  //fetch all classes box plots
  app.get(
    '/api/getAllClassesBoxPlotAttributes',
    cache,
    allSeasonsController.getAllClassesBoxPlotAttributes
  );

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
  app.get('/api/userInfo', authenticateAdmin, usersController.getUsersInfo);

  app.get('/api/releases', releasesController.getReleases);
  app.post('/api/releases', releasesController.createRelease);

  app.get('/api/geoSites', geoSitesController.index);
  app.get('/api/geoRegions', geoRegionsController.index);

  app.post(
    '/api/admin/update-class-metrics',
    authenticateAdmin,
    adminUpdates.updateClassMetricData
  );
  app.post(
    '/api/admin/update-gauge-metrics/:id',
    authenticateAdmin,
    adminUpdates.updateGaugeMetricData
  );
  app.post('/api/admin/broadcast-message', authenticateAdmin, (req, res) =>
    adminUpdates.broadcastDownServerMsg(req, res, app.io)
  );
  app.post(
    '/api/admin/upload-flow-date',
    authenticateAdmin,
    adminUpdates.uploadFlowData
  );
  app.post(
    '/api/admin/upload-metric-result',
    authenticateAdmin,
    adminUpdates.uploadMetricResult
  );
  app.post(
    '/api/admin/upload-class-hydrograph',
    authenticateAdmin,
    adminUpdates.uploadClassHydrograph
  );
  app.post(
    '/api/admin/upload-gauge-hydrograph',
    authenticateAdmin,
    adminUpdates.uploadGaugeHydrograph
  );
  app.post(
    '/api/admin/upload_flow_condition',
    authenticateAdmin,
    adminUpdates.uploadAnnualCondition
  );

  app.post('/api/user/signup', usersController.signUp);
  app.post('/api/user/login', usersController.login);
  app.post('/api/user/getme', authenticate, usersController.getMe);
  app.post(
    '/api/user/getFailedUploads',
    authenticate,
    usersController.failedUploads
  );
  app.post('/api/user/getUploads', authenticate, usersController.getUploads);
  app.delete(
    '/api/uploadData',
    authenticate,
    usersController.deleteUploadedFile
  );

  app.post('/api/uploadData', authenticate, flaskAPIs.calculateMetrics);
  app.post('/api/class-predict', authenticate, flaskAPIs.predictClass);
};
