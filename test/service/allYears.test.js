const chai = require('chai');
const assert = require('assert');
const app = require('../../src/app');
const chaiHttp = require('chai-http');
const factories = require('../factories');
const db = require('../../src/models');

chai.use(chaiHttp);

describe('allYears services', () => {
  beforeEach(async () => {
    await db.sequelize.sync({force: true, logging: false});
  });

  it('should GET allYears', async () => {
    const allYear = await factories.create('allYear');
    const res = await chai
      .request(app)
      .post('/api/allYears')
      .send({gaugeId: allYear.dataValues.gaugeId});
    assert.equal(res.body.gaugeId, allYear.dataValues.gaugeId);
    assert.equal(res.body.average.length, allYear.dataValues.average.length);
  });

  it('should get box attributes for gauge', async () => {
    const allYear = await factories.create('allYear');
    const res = await chai
      .request(app)
      .post('/api/allyears/getBoxPlotAttributes')
      .send({metric: 'average', gaugeId: allYear.dataValues.gaugeId});

    assert.equal(res.body.type, 'Gauge');
    assert.equal(res.body.metricName, 'all yearAverage');
    assert.equal(res.body.quartile.length, 3);
    assert.equal(res.body.whiskers.length, 2);
  });

  it('should get box attributes for class', async () => {
    await factories.create('allYear');
    const res = await chai
      .request(app)
      .post('/api/allyears/getBoxPlotAttributes')
      .send({metric: 'average', classId: 1});
    assert.equal(res.body.type, 'Class');
    assert.equal(res.body.metricName, 'all yearAverage');
    assert.equal(res.body.quartile.length, 3);
    assert.equal(res.body.whiskers.length, 2);
  });

  it('should response with 400 when missing gaugeId or classId', async () => {
    await chai
      .request(app)
      .post('/api/allyears/getBoxPlotAttributes')
      .send({metric: 'average'})
      .catch(err => {
        assert.equal(err.response.status, 400);
      });
  });
});
