import {dataHandling} from '../utils/dataHandling';

const Gauge = require('../models').Gauge;

module.exports = {
  show(req, res) {
    const data = dataHandling();
    res.status(200).send(data);
  },

  create(req, res) {
    Gauge.bulkCreate([
      {id: 123456, name: '1'},
      {id: 123457, name: '2'},
      {id: 123458, name: '3'},
    ])
      .then(() => {
        // Notice: There are no arguments here, as of right now you'll have to...
        return Gauge.findAll();
      })
      .then(users => {
        console.log(users); // ... in order to get the array of user objects
      });
  },
};
