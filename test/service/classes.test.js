const chai = require('chai');
const assert = require('assert');
const app = require('../../src/app');
const chaiHttp = require('chai-http');
const db = require('../../src/models');
const factories = require('../factories');

chai.use(chaiHttp);

describe('Class services', () => {
  beforeEach(async () => {
    await db.sequelize.sync({force: true, logging: false});
  });

  it('should list all classes', async () => {
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(factories.create('classification'));
    }
    Promise.all(promises).then(async () => {
      const res = await chai.request(app).get('/api/classes');
      assert.equal(res.body.length, 10);
    });
  });

  it('should show a class', async () => {
    const newClass = await factories.create('classification'),
      classId = newClass.dataValues.id;
    const res = await chai.request(app).get(`/api/classes/${classId}`);
    assert.equal(res.body.id, classId);
    assert.equal(res.body.name, newClass.dataValues.name);
  });
});
