const chai = require('chai');
const assert = require('assert');
const app = require('../../src/app');
const chaiHttp = require('chai-http');
const db = require('../../src/models');
const factories = require('../factories');

chai.use(chaiHttp);

describe('Gauge services', () => {
  beforeEach(async () => {
    await db.sequelize.sync({force: true, logging: false});
  });

  it('should list all gauges', async () => {
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(factories.create('gauge'));
    }
    Promise.all(promises).then(async () => {
      const res = await chai.request(app).get('/api/gauges');
      assert.equal(res.body.length, 10);
    });
  });

  it('should show specific gauge', async () => {
    const newGauge = await factories.create('gauge'),
      res = await chai
        .request(app)
        .get(`/api/gauges/${newGauge.dataValues.id}`);
    assert.equal(res.body.id, newGauge.dataValues.id);
    assert.equal(res.body.stationName, newGauge.dataValues.stationName);
  });

  it('should search gauge by id', async () => {
    const newGauge = await factories.create('gauge'),
      res = await chai
        .request(app)
        .post('/api/gauges/search')
        .send({keyWord: newGauge.dataValues.id});
    assert.equal(res.body.length, 1);
    assert.equal(res.body[0].id, newGauge.dataValues.id);
  });

  it('should search gauge by station name', async () => {
    const newGauge = await factories.create('gauge'),
      res = await chai
        .request(app)
        .post('/api/gauges/search')
        .send({keyWord: newGauge.dataValues.stationName});
    assert.equal(res.body.length, 1);
    assert.equal(res.body[0].id, newGauge.dataValues.id);
  });
});
