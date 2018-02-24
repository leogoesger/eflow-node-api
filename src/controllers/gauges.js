import axios from 'axios';
const Gauge = require('../models').Gauge;
const Year = require('../models').Year;

module.exports = {
  create(req, res) {
    Gauge.create(req.body)
      .then(gauge => res.status(201).send(gauge))
      .catch(err => res.status(400).send(err));
  },

  index(req, res) {
    return Gauge.findAll({include: [{model: Year, as: 'years'}]})
      .then(gauge => res.status(200).send(gauge))
      .catch(err => res.status(400).send(err));
  },

  async show(req, res) {
    const response = await axios.get(
      'https://eflow.nyc3.digitaloceanspaces.com/2_23_annual_flow_result/10255800_annual_result_matrix.csv'
    );
    return res.status(201).send(response.data);
    // return Gauge.findById(req.params.gaugeId, {
    //   include: [{model: Year, as: 'years'}],
    // })
    //   .then(gauge => res.status(200).send(gauge))
    //   .catch(err => res.status(400).send(err));
  },
};
